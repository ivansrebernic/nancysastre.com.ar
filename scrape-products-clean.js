import puppeteer from 'puppeteer';
import fs from 'fs';

(async () => {
  const browser = await puppeteer.launch({ 
    headless: false, // Set to true for production
    slowMo: 50 // Add delay between actions for debugging
  });
  const page = await browser.newPage();

  try {
    console.log('Navigating to the main products page...');
    
    // Navigate to the main page to get product IDs
    await page.goto('https://ifuxion.com/NANCYSASTRE/enrollment/products', {
      waitUntil: 'networkidle2',
      timeout: 30000
    });

    console.log('Finding product elements...');

    // Get all product containers with modal buttons to extract product IDs
    const productElements = await page.$$eval('h2[class*="modalBtn"]', elements => {
      return elements.map(el => ({
        modalClass: el.className,
        productId: el.className.match(/modalBtn(\d+)/)?.[1],
        name: el.querySelector('.nameProduct strong')?.textContent?.trim()
      }));
    });

    console.log(`Found ${productElements.length} products with IDs`);
    
    const detailedProducts = [];

    for (let i = 0; i < productElements.length; i++) {
      const product = productElements[i];
      console.log(`\nProcessing product ${i + 1}/${productElements.length}: ${product.name} (ID: ${product.productId})`);

      try {
        // Navigate to detail page using productId
        const detailUrl = `https://ifuxion.com/NANCYSASTRE/enrollment/productsdet?itemcode=${product.productId}`;
        console.log(`Navigating to: ${detailUrl}`);
        
        await page.goto(detailUrl, { 
          waitUntil: 'networkidle0',
          timeout: 30000 
        });

        // Wait a bit for content to load
        await new Promise(resolve => setTimeout(resolve, 2000));

        // Extract detailed information from the detail page
        const productDetails = await page.evaluate(() => {
          const getTextContent = (selector) => {
            const el = document.querySelector(selector);
            return el ? el.textContent.trim() : '';
          };

          const getAllTextContent = (selectors) => {
            for (const selector of selectors) {
              const text = getTextContent(selector);
              if (text) return text;
            }
            return '';
          };

          // Try various selectors for description
          const description = getAllTextContent([
            '.description',
            '.product-description', 
            '.descripcion',
            '[class*="descripcion"]',
            '[class*="description"]',
            '.content p',
            '.main-content p',
            'p'
          ]);

          // Try various selectors for benefits
          const benefits = getAllTextContent([
            '.benefits',
            '.beneficios',
            '[class*="benefit"]',
            '[class*="beneficio"]',
            '.features',
            '.caracteristicas'
          ]);

          // Try various selectors for usage
          const usage = getAllTextContent([
            '.usage',
            '.uso',
            '.instructions',
            '.instrucciones',
            '[class*="uso"]',
            '[class*="instruc"]',
            '[class*="usage"]'
          ]);

          // Get page title and main content for fallback
          const pageTitle = document.title || '';
          const mainContent = document.body ? document.body.textContent.substring(0, 2000) : '';

          // Extract product name from page
          const productName = getTextContent('h1') || 
                             getTextContent('.product-title') || 
                             getTextContent('.title') ||
                             '';

          // Extract price information
          const price = getAllTextContent([
            '.price',
            '.precio',
            '[class*="price"]',
            '[class*="precio"]'
          ]);

          return {
            productName,
            description,
            benefits,
            usage,
            price,
            pageTitle,
            mainContent: mainContent.substring(0, 1000) // First 1000 chars for debugging
          };
        });

        console.log(`✓ Extracted details for: ${product.name}`);
        console.log(`  - Description: ${productDetails.description.substring(0, 100)}...`);
        console.log(`  - Benefits: ${productDetails.benefits.substring(0, 100)}...`);
        console.log(`  - Usage: ${productDetails.usage.substring(0, 100)}...`);

        // Combine all information
        const completeProduct = {
          id: product.productId,
          name: product.name,
          detailUrl: detailUrl,
          ...productDetails
        };

        detailedProducts.push(completeProduct);

      } catch (error) {
        console.log(`⚠️  Error processing ${product.name}: ${error.message}`);
        
        // Add minimal info even if extraction fails
        detailedProducts.push({
          id: product.productId,
          name: product.name,
          error: error.message,
          detailUrl: `https://ifuxion.com/NANCYSASTRE/enrollment/productsdet?itemcode=${product.productId}`
        });
      }
    }

    console.log(`\n✅ Successfully processed ${detailedProducts.length} products`);

    // Save detailed results
    fs.writeFileSync('products-detailed-clean.json', JSON.stringify(detailedProducts, null, 2));
    console.log('Detailed products saved to products-detailed-clean.json');

    // Create enhanced HTML report
    const htmlReport = `
<!DOCTYPE html>
<html>
<head>
    <title>Detailed Product Information - Fuxion</title>
    <style>
        body { font-family: Arial, sans-serif; margin: 20px; line-height: 1.6; }
        .product { border: 1px solid #ddd; margin: 20px 0; padding: 20px; border-radius: 8px; }
        .product h3 { margin-top: 0; color: #2c3e50; border-bottom: 2px solid #3498db; padding-bottom: 10px; }
        .price { font-size: 1.3em; font-weight: bold; color: #e74c3c; margin: 10px 0; }
        .section { margin: 15px 0; }
        .section h4 { color: #34495e; margin: 10px 0 5px 0; }
        .section p { margin: 5px 0; }
        .debug { background: #f8f9fa; padding: 10px; margin: 10px 0; font-size: 0.9em; border-left: 4px solid #6c757d; }
        .error { background: #f8d7da; padding: 10px; margin: 10px 0; border-left: 4px solid #dc3545; }
    </style>
</head>
<body>
    <h1>🔍 Detailed Product Information - Fuxion Hidratación Saludable</h1>
    <p><strong>Total products analyzed:</strong> ${detailedProducts.length}</p>
    
    ${detailedProducts.map((product, index) => `
        <div class="product">
            <h3>${product.name || 'Unknown Product'} (ID: ${product.id})</h3>
            
            ${product.error ? `
                <div class="error">
                    <h4>⚠️ Error</h4>
                    <p>${product.error}</p>
                    <p><a href="${product.detailUrl}" target="_blank">View Detail Page</a></p>
                </div>
            ` : ''}
            
            ${product.price ? `<div class="price">💰 Price: ${product.price}</div>` : ''}
            
            ${product.description ? `
                <div class="section">
                    <h4>📝 Description</h4>
                    <p>${product.description}</p>
                </div>
            ` : ''}
            
            ${product.benefits ? `
                <div class="section">
                    <h4>✨ Benefits</h4>
                    <p>${product.benefits}</p>
                </div>
            ` : ''}
            
            ${product.usage ? `
                <div class="section">
                    <h4>📋 How to Use</h4>
                    <p>${product.usage}</p>
                </div>
            ` : ''}
            
            ${product.mainContent ? `
                <div class="debug">
                    <h4>🔍 Page Content (Debug)</h4>
                    <p>${product.mainContent.substring(0, 500)}${product.mainContent.length > 500 ? '...' : ''}</p>
                    <p><a href="${product.detailUrl}" target="_blank">View Full Detail Page</a></p>
                </div>
            ` : ''}
        </div>
    `).join('')}
</body>
</html>`;

    fs.writeFileSync('products-detailed-clean-report.html', htmlReport);
    console.log('Enhanced HTML report saved to products-detailed-clean-report.html');

  } catch (error) {
    console.error('Error occurred:', error);
  } finally {
    await browser.close();
  }
})();
