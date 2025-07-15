import puppeteer from 'puppeteer';
import fs from 'fs';

(async () => {
  const browser = await puppeteer.launch({ 
    headless: false, // Keep visible to debug
    slowMo: 50 
  });
  const page = await browser.newPage();

  try {
    console.log('Starting detail page scraping...');
    
    // First, navigate to the main products page to establish session
    await page.goto('https://ifuxion.com/NANCYSASTRE/enrollment/products', {
      waitUntil: 'networkidle2',
      timeout: 30000
    });

    console.log('Main page loaded, extracting product IDs...');

    // Get all product IDs from the main page
    const productElements = await page.$$eval('h2[class*="modalBtn"]', elements => {
      return elements.map(el => ({
        modalClass: el.className,
        productId: el.className.match(/modalBtn(\d+)/)?.[1],
        name: el.querySelector('.nameProduct strong')?.textContent?.trim()
      }));
    });

    console.log(`Found ${productElements.length} products to scrape`);
    
    const detailedProducts = [];

    for (let i = 0; i < productElements.length; i++) {
      const product = productElements[i];
      console.log(`\n🔍 Processing ${i + 1}/${productElements.length}: ${product.name} (ID: ${product.productId})`);

      try {
        // Navigate to detail page
        const detailUrl = `https://ifuxion.com/NANCYSASTRE/enrollment/productsdet?itemcode=${product.productId}`;
        console.log(`   📄 Loading: ${detailUrl}`);
        
        await page.goto(detailUrl, { 
          waitUntil: 'networkidle0',
          timeout: 30000 
        });

        // Wait for content to load
        await new Promise(resolve => setTimeout(resolve, 3000));

        // Take a screenshot for debugging
        await page.screenshot({ path: `product-${product.productId}-screenshot.png` });

        // Extract comprehensive detail information
        const detailInfo = await page.evaluate(() => {
          // Helper function to get text content safely
          const getTextContent = (selector) => {
            const el = document.querySelector(selector);
            return el ? el.textContent.trim() : '';
          };

          // Helper function to get all matching elements text
          const getAllTextContent = (selector) => {
            const elements = document.querySelectorAll(selector);
            return Array.from(elements).map(el => el.textContent.trim()).filter(text => text.length > 0);
          };

          // Helper function to get attribute value
          const getAttribute = (selector, attr) => {
            const el = document.querySelector(selector);
            return el ? el.getAttribute(attr) : '';
          };

          // Extract page title and basic info
          const pageTitle = document.title || '';
          const pageUrl = window.location.href;

          // Extract product information from various possible selectors
          const productInfo = {
            title: getTextContent('h1') || 
                   getTextContent('.product-title') || 
                   getTextContent('.title') || 
                   getTextContent('[class*="title"]') ||
                   getTextContent('h2') || 
                   getTextContent('h3'),

            description: getTextContent('.description') ||
                        getTextContent('.product-description') ||
                        getTextContent('.descripcion') ||
                        getTextContent('[class*="descripcion"]') ||
                        getTextContent('.content') ||
                        getTextContent('.product-content'),

            benefits: getTextContent('.benefits') ||
                     getTextContent('.beneficios') ||
                     getTextContent('[class*="benefit"]') ||
                     getTextContent('[class*="beneficio"]'),

            usage: getTextContent('.usage') ||
                   getTextContent('.uso') ||
                   getTextContent('.instructions') ||
                   getTextContent('[class*="uso"]') ||
                   getTextContent('[class*="instruc"]'),

            ingredients: getTextContent('.ingredients') ||
                        getTextContent('.ingredientes') ||
                        getTextContent('[class*="ingredient"]'),

            price: getTextContent('.price') ||
                   getTextContent('.precio') ||
                   getTextContent('[class*="price"]'),

            points: getTextContent('.points') ||
                   getTextContent('.puntos') ||
                   getTextContent('[class*="point"]')
          };

          // Extract all images
          const images = [];
          document.querySelectorAll('img').forEach(img => {
            if (img.src && !img.src.includes('icon') && !img.src.includes('logo')) {
              images.push({
                src: img.src,
                alt: img.alt || '',
                title: img.title || ''
              });
            }
          });

          // Extract all links
          const links = [];
          document.querySelectorAll('a[href]').forEach(link => {
            if (link.href && link.textContent.trim()) {
              links.push({
                href: link.href,
                text: link.textContent.trim()
              });
            }
          });

          // Extract structured data if present
          const structuredData = [];
          document.querySelectorAll('script[type="application/ld+json"]').forEach(script => {
            try {
              structuredData.push(JSON.parse(script.textContent));
            } catch (e) {
              // Ignore invalid JSON
            }
          });

          // Extract all text content for analysis
          const allParagraphs = getAllTextContent('p');
          const allListItems = getAllTextContent('li');
          const allTableCells = getAllTextContent('td, th');

          // Extract form data if present
          const formData = {};
          document.querySelectorAll('input, select, textarea').forEach(input => {
            if (input.name || input.id) {
              const key = input.name || input.id;
              formData[key] = input.value || input.textContent || '';
            }
          });

          // Get all text content for fallback
          const bodyText = document.body ? document.body.textContent : '';
          
          // Extract specific product details by looking for common patterns
          const detailSections = {};
          
          // Look for sections with headings
          document.querySelectorAll('h1, h2, h3, h4, h5, h6').forEach(heading => {
            const headingText = heading.textContent.trim().toLowerCase();
            let nextElement = heading.nextElementSibling;
            let sectionContent = '';
            
            // Collect content after the heading until next heading
            while (nextElement && !['H1', 'H2', 'H3', 'H4', 'H5', 'H6'].includes(nextElement.tagName)) {
              if (nextElement.textContent.trim()) {
                sectionContent += nextElement.textContent.trim() + ' ';
              }
              nextElement = nextElement.nextElementSibling;
            }
            
            if (sectionContent) {
              detailSections[headingText] = sectionContent.trim();
            }
          });

          return {
            pageTitle,
            pageUrl,
            productInfo,
            images,
            links,
            structuredData,
            allParagraphs,
            allListItems,
            allTableCells,
            formData,
            detailSections,
            fullBodyText: bodyText.substring(0, 5000), // Limit to first 5000 chars
            extractedAt: new Date().toISOString()
          };
        });

        console.log(`   ✅ Extracted ${Object.keys(detailInfo.detailSections).length} sections`);
        console.log(`   📷 Screenshot saved: product-${product.productId}-screenshot.png`);

        // Combine with basic product info
        const completeProduct = {
          id: product.productId,
          name: product.name,
          detailUrl: detailUrl,
          scrapedAt: new Date().toISOString(),
          detailPageData: detailInfo
        };

        detailedProducts.push(completeProduct);

      } catch (error) {
        console.log(`   ❌ Error: ${error.message}`);
        
        // Add minimal info even if extraction fails
        detailedProducts.push({
          id: product.productId,
          name: product.name,
          detailUrl: `https://ifuxion.com/NANCYSASTRE/enrollment/productsdet?itemcode=${product.productId}`,
          error: error.message,
          scrapedAt: new Date().toISOString()
        });
      }
    }

    console.log(`\n🎉 Successfully processed ${detailedProducts.length} products`);

    // Save the detailed data
    const outputData = {
      metadata: {
        totalProducts: detailedProducts.length,
        scrapedAt: new Date().toISOString(),
        source: 'ifuxion.com/hidratacionsaludable',
        note: 'Detail page content extracted with full context'
      },
      products: detailedProducts
    };

    fs.writeFileSync('products-with-details.json', JSON.stringify(outputData, null, 2));
    console.log('\n📄 Detailed products saved to: products-with-details.json');

    // Create an enhanced version that merges with existing simple data
    try {
      const existingSimple = JSON.parse(fs.readFileSync('products-simple.json', 'utf8'));
      
      const enhancedProducts = existingSimple.map(simple => {
        const detailed = detailedProducts.find(d => d.id === simple.id);
        return {
          ...simple,
          detailPageData: detailed ? detailed.detailPageData : null,
          lastUpdated: new Date().toISOString()
        };
      });

      fs.writeFileSync('products-enhanced.json', JSON.stringify(enhancedProducts, null, 2));
      console.log('📄 Enhanced products saved to: products-enhanced.json');
    } catch (e) {
      console.log('⚠️  Could not merge with existing simple data');
    }

    // Create summary report
    const summaryReport = detailedProducts.map(product => ({
      id: product.id,
      name: product.name,
      hasError: !!product.error,
      sectionsFound: product.detailPageData ? Object.keys(product.detailPageData.detailSections).length : 0,
      imagesFound: product.detailPageData ? product.detailPageData.images.length : 0,
      linksFound: product.detailPageData ? product.detailPageData.links.length : 0
    }));

    console.log('\n📊 Summary Report:');
    summaryReport.forEach(item => {
      console.log(`   ${item.name} (${item.id}): ${item.sectionsFound} sections, ${item.imagesFound} images, ${item.linksFound} links`);
    });

  } catch (error) {
    console.error('❌ Fatal error:', error);
  } finally {
    await browser.close();
  }
})();
