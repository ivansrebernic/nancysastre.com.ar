import { NotionToMarkdown } from 'notion-to-md';
import { Client } from '@notionhq/client';
import fs from 'fs';
import path from 'path';
import https from 'https';
import { URL } from 'url';
import 'dotenv/config';

const notion = new Client({ auth: process.env.NOTION_TOKEN });
const n2m = new NotionToMarkdown({ notionClient: notion });

const databaseId = process.env.NOTION_DB_ID;
const outputDir = './src/content/blog';
const imageDir = './public/image/blog';

async function downloadImage(url, filepath) {
  return new Promise((resolve, reject) => {
    const file = fs.createWriteStream(filepath);
    https.get(url, (response) => {
      if (response.statusCode === 302 || response.statusCode === 301) {
        // Handle redirects
        https.get(response.headers.location, (redirectResponse) => {
          redirectResponse.pipe(file);
          file.on('finish', () => {
            file.close();
            resolve(filepath);
          });
        }).on('error', reject);
      } else {
        response.pipe(file);
        file.on('finish', () => {
          file.close();
          resolve(filepath);
        });
      }
    }).on('error', reject);
  });
}

function getImageExtension(url) {
  const urlObj = new URL(url);
  const pathname = urlObj.pathname;
  const ext = path.extname(pathname).toLowerCase();
  return ext || '.jpg'; // Default to .jpg if no extension
}

function getProperty(page, key) {
  const prop = page.properties[key];
  if (!prop) return null;

  switch (prop.type) {
    case 'title':
      return prop.title.map(t => t.plain_text).join('');
    case 'rich_text':
      return prop.rich_text.map(t => t.plain_text).join('');
    case 'checkbox':
      return prop.checkbox;
    case 'date':
      return prop.date?.start || null;
    case 'select':
      return prop.select?.name || null;
    case 'multi_select':
      return prop.multi_select.map(tag => tag.name);
    case 'url':
      return prop.url;
    case 'files':
      if (prop.files && prop.files.length > 0) {
        const file = prop.files[0];
        
        // Handle different file structures from Notion API
        if (file.type === 'external' && file.external) {
          return file.external.url;
        } else if (file.type === 'file' && file.file) {
          return file.file.url;
        }
        // Fallback for other cases
        return null;
      }
      return null;
    default:
      return null;
  }
}

async function processMarkdownImages(content, slug) {
  // Regular expression to find all image URLs in markdown
  const imageRegex = /!\[([^\]]*)\]\(([^)]+)\)/g;
  let processedContent = content;
  let imageCounter = 1;

  const matches = [...content.matchAll(imageRegex)];
  
  for (const match of matches) {
    const fullMatch = match[0];
    const altText = match[1];
    const imageUrl = match[2];
    
    // Skip if already a local path
    if (imageUrl.startsWith('/') || imageUrl.startsWith('./')) {
      continue;
    }
    
    try {
      const ext = getImageExtension(imageUrl);
      const filename = `${slug}-${imageCounter}${ext}`;
      const localPath = path.join(imageDir, filename);
      const publicPath = `/image/blog/${filename}`;
      
      console.log(`  📥 Descargando imagen ${imageCounter}: ${filename}`);
      await downloadImage(imageUrl, localPath);
      
      // Replace the URL in the markdown
      processedContent = processedContent.replace(fullMatch, `![${altText}](${publicPath})`);
      imageCounter++;
    } catch (error) {
      console.error(`  ❌ Error descargando imagen: ${error.message}`);
    }
  }
  
  return processedContent;
}

async function exportPublishedArticles() {
  const { results } = await notion.databases.query({
    database_id: databaseId,
    filter: {
      property: 'Publicado',
      checkbox: { equals: true },
    },
  });

  if (!fs.existsSync(outputDir)) fs.mkdirSync(outputDir, { recursive: true });
  if (!fs.existsSync(imageDir)) fs.mkdirSync(imageDir, { recursive: true });

  for (const page of results) {
    const title = getProperty(page, 'Título') || 'sin-titulo';
    const slug = title.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9\-]/g, '');
    const description = getProperty(page, 'Descripción') || '';
    const author = getProperty(page, 'Autor') || 'Nancy Sastre';
    const pubDate = getProperty(page, 'Fecha de publicación') || new Date().toISOString();
    const updatedDate = getProperty(page, 'Fecha de actualización');
    let heroImage = getProperty(page, 'Imagen destacada');
    const category = getProperty(page, 'Categoría') || 'nutricion';
    const tags = getProperty(page, 'Tags') || [];
    const featured = getProperty(page, 'Destacado') || false;
    const instagramCaption = getProperty(page, 'Caption IG') || '';

    console.log(`\n📝 Procesando: ${title}`);

    // Download hero image if it's an external URL
    if (heroImage && !heroImage.startsWith('/') && !heroImage.startsWith('./')) {
      try {
        const ext = getImageExtension(heroImage);
        const heroFilename = `${slug}-hero${ext}`;
        const heroLocalPath = path.join(imageDir, heroFilename);
        const heroPublicPath = `/image/blog/${heroFilename}`;
        
        console.log(`  📥 Descargando imagen destacada: ${heroFilename}`);
        await downloadImage(heroImage, heroLocalPath);
        heroImage = heroPublicPath;
      } catch (error) {
        console.error(`  ❌ Error descargando imagen destacada: ${error.message}`);
      }
    }

    const mdBlocks = await n2m.pageToMarkdown(page.id);
    let mdString = n2m.toMarkdownString(mdBlocks);
    
    // Process inline images in the markdown content
    mdString.parent = await processMarkdownImages(mdString.parent, slug);

    const frontmatter = {
      title,
      description,
      author,
      pubDate,
      ...(updatedDate ? { updatedDate } : {}),
      ...(heroImage ? { heroImage } : {}),
      category,
      tags,
      featured,
      ...(instagramCaption ? { instagramCaption } : {}),
    };

    const yaml = `---\n${Object.entries(frontmatter)
      .map(([k, v]) => {
        if (Array.isArray(v)) {
          return `${k}: [${v.map(tag => `"${tag}"`).join(', ')}]`;
        } else if (typeof v === 'boolean') {
          return `${k}: ${v}`;
        } else {
          return `${k}: "${v}"`;
        }
      })
      .join('\n')}\n---\n\n`;

    const filePath = path.join(outputDir, `${slug}.md`);
    fs.writeFileSync(filePath, yaml + mdString.parent);
    console.log(`✅ Exportado: ${slug}.md`);
  }
}

exportPublishedArticles();