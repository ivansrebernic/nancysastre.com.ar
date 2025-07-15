# Notion Blog Integration Guide

This guide explains the complete setup for integrating Notion as your blog CMS with automatic exports to your Astro website.

## Overview

The integration allows you to:
- Write blog posts in Notion
- Automatically export them to your website
- Trigger exports on-demand from Notion
- Maintain SEO-friendly markdown files

## Architecture

```
Notion Database → GitHub Action → Markdown Files → Astro Build → Vercel Deploy
```

## Notion Database Setup

### Required Properties

Your Notion database must have these properties:

| Property | Type | Required | Description |
|----------|------|----------|-------------|
| Título | Title | Yes | Blog post title (used for slug) |
| Descripción | Text | Yes | SEO meta description |
| Autor | Text | No | Defaults to "Iván Srebernic" |
| Fecha de publicación | Date | Yes | Publication date |
| Fecha de actualización | Date | No | Last update date |
| Imagen destacada | Files & media | No | Hero image (upload directly) |
| Categoría | Select | Yes | One of: nutricion, ejercicio, negocio, testimonios, productos |
| Tags | Multi-select | No | Blog tags |
| Destacado | Checkbox | No | Featured post flag |
| Caption IG | Text | No | Instagram caption |
| **Publicado** | Checkbox | Yes | Must be checked to export |

### Categories

Valid categories:
- `nutricion`
- `ejercicio`
- `negocio`
- `testimonios`
- `productos`

## Triggering Exports

### Method 1: Automatic (Hourly)
The GitHub Action runs every hour automatically and exports all posts with `Publicado = true`.

### Method 2: Manual (GitHub)
1. Go to your repository on GitHub
2. Click "Actions" tab
3. Select "Exportar blogs desde Notion"
4. Click "Run workflow"

### Method 3: From Notion (Webhook)
Follow the setup in `NOTION_WEBHOOK_SETUP.md` to trigger exports directly from Notion.

## Writing Blog Posts

### 1. Create New Post
- Add a new page to your Notion database
- Fill in all required properties
- Write your content using Notion's editor

### 2. Formatting
- Use Notion's built-in formatting (headings, lists, quotes)
- Images can be embedded directly
- Code blocks are supported
- Tables work as expected

### 3. Publishing
- Set `Publicado` to ✓ when ready
- The post will be exported on the next run
- Check your website after a few minutes

## File Generation

Posts are exported as:
```
src/content/blog/[slug].md
```

Where `slug` is generated from the title:
- Converted to lowercase
- Spaces replaced with hyphens
- Special characters removed

Example: "Mi Primer Post!" → `mi-primer-post.md`

## Troubleshooting

### Post Not Appearing
1. Check `Publicado` is checked in Notion
2. Verify all required fields are filled
3. Check GitHub Actions for errors
4. Ensure category is valid

### Build Errors
- Check featured field is boolean (not string)
- Verify dates are in correct format
- Ensure category matches allowed values

### Slug Issues
- Avoid special characters in titles
- Use descriptive titles for better URLs
- Check for duplicate titles

## Best Practices

1. **SEO**: Write descriptive titles and descriptions
2. **Images**: Use high-quality hero images
3. **Categories**: Choose the most relevant category
4. **Tags**: Use consistent tag naming
5. **Instagram**: Add captions for social sharing

## Environment Variables

Required in GitHub Secrets:
- `NOTION_TOKEN`: Your Notion integration token
- `NOTION_DB_ID`: Your database ID

## Local Development

To test locally:
```bash
npm run export:blog
```

Ensure `.env` file contains:
```
NOTION_TOKEN=your_token_here
NOTION_DB_ID=your_database_id_here
```