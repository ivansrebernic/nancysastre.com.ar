import puppeteer from 'puppeteer';
import fs from 'fs';

(async () => {
  const browser = await puppeteer.launch({ 
    headless: false, // Set to true for production
    slowMo: 50 // Add delay between actions for debugging
  });
  const page = await browser.newPage();

  try {
    console.log('Navigating to the page...');
    
    // Navigate to the page
    await page.goto('https://ifuxion.com/NANCYSASTRE/enrollment/products', {
      waitUntil: 'networkidle2',
      timeout: 30000
    });

    console.log('Finding product elements...');

    // Get all product containers with modal buttons
    const productElements = await page.$$eval('h2[class*="modalBtn"]', elements => {
      return elements.map(el => ({
        modalClass: el.className,
        productId: el.className.match(/modalBtn(\d+)/)?.[1],
        name: el.querySelector('.nameProduct strong')?.textContent?.trim()
      }));
    });

    console.log(`Found ${productElements.length} products with modal buttons`);
    
    const detailedProducts = [];

    for (let i = 0; i < productElements.length; i++) {
      const product = productElements[i];
    console.log(`\nProcessing product ${i + 1}/${productElements.length}: ${product.name}`);

      // Navigate to detail page using productId
      const detailUrl = `https://ifuxion.com/NANCYSASTRE/enrollment/productsdet?itemcode=${product.productId}`;
      console.log(`Navigating to detail page: ${detailUrl}`);
      await page.goto(detailUrl, { waitUntil: 'networkidle0' });

      try {
        // Extract detailed information from the detail page
        const productDetails = await page.evaluate(() => {
          const getTextContent = (selector) => {
            const el = document.querySelector(selector);
            return el ? el.textContent.trim() : '';
          };

          const description = getTextContent('.description') ||
                             getTextContent('.product-description') ||
                             getTextContent('p');

          const benefits = getTextContent('.benefits') ||
                           getTextContent('.beneficios') ||
                           getTextContent('[class*="benefit"]');

          const usage = getTextContent('.usage') ||
                        getTextContent('.uso') ||
                        getTextContent('[class*="uso"]');

          return {
            description,
            benefits,
            usage
          };
        });

        console.log(`Extracted details for ${product.name}:`, productDetails);

        // Combine detailed info with basic info
        const completeProduct = {
          ...product,
          ...productDetails
        };

        // Wait a bit for content to load
        await new Promise(resolve => setTimeout(resolve, 2000));

        // Extract detailed information from the modal
        const productDetails = await page.evaluate(() => {
          // Look for modal content
          const modal = document.querySelector('.modal-dialog') || 
                       document.querySelector('.modal-content') || 
                       document.querySelector('.popup') ||
                       document.querySelector('[role="dialog"]') ||
                       document.querySelector('.modal');

          if (!modal) return null;

          // Extract various pieces of information
          const getTextContent = (selector) => {
            const el = modal.querySelector(selector);
            return el ? el.textContent.trim() : '';
          };

          // Look for description
          const description = getTextContent('.description') ||
                             getTextContent('.product-description') ||
                             getTextContent('p') ||
                             getTextContent('.modal-body p') ||
                             '';

          // Look for benefits
          const benefits = getTextContent('.benefits') ||
                          getTextContent('.beneficios') ||
                          getTextContent('[class*="benefit"]') ||
                          '';

          // Look for usage instructions
          const usage = getTextContent('.usage') ||
                       getTextContent('.uso') ||
                       getTextContent('.instructions') ||
                       getTextContent('[class*="uso"]') ||
                       getTextContent('[class*="instruc"]') ||
                       '';

          // Get all text content for analysis
          const allText = modal.textContent || '';

          // Try to extract sections based on common keywords
          const textSections = {};
          const lines = allText.split('\n').map(line => line.trim()).filter(line => line.length > 0);
          
          let currentSection = '';
          lines.forEach(line => {
            const lowerLine = line.toLowerCase();
            if (lowerLine.includes('descripción') || lowerLine.includes('description')) {
              currentSection = 'description';
              textSections[currentSection] = textSections[currentSection] || [];
            } else if (lowerLine.includes('beneficio') || lowerLine.includes('benefit')) {
              currentSection = 'benefits';
              textSections[currentSection] = textSections[currentSection] || [];
            } else if (lowerLine.includes('uso') || lowerLine.includes('cómo usar') || lowerLine.includes('instruc')) {
              currentSection = 'usage';
              textSections[currentSection] = textSections[currentSection] || [];
            } else if (currentSection && line.length > 10) {
              textSections[currentSection] = textSections[currentSection] || [];
              textSections[currentSection].push(line);
            }
          });

          return {
            description: description || (textSections.description ? textSections.description.join(' ') : ''),
            benefits: benefits || (textSections.benefits ? textSections.benefits.join(' ') : ''),
            usage: usage || (textSections.usage ? textSections.usage.join(' ') : ''),
            allModalText: allText.substring(0, 1000), // First 1000 chars for debugging
            modalHTML: modal.innerHTML.substring(0, 2000) // First 2000 chars of HTML for debugging
          };
        });

        // Also get basic product info from the main page
        const basicInfo = await page.evaluate((productId) => {
          const productContainer = document.querySelector(`h2[class*="modalBtn${productId}"]`)?.closest('.col-md-4') || 
                                  document.querySelector(`h2[class*="modalBtn${productId}"]`)?.closest('div');
          
          if (!productContainer) return {};

          const name = productContainer.querySelector('.nameProduct strong')?.textContent?.trim() || '';
          const price = productContainer.querySelector('.price.colorTheme')?.textContent?.trim() || '';
          const priceValue = productContainer.querySelector('.priceProduct')?.value || '';
          const points = productContainer.querySelector('.pointProduct')?.value || 
                        productContainer.querySelector('.number')?.textContent?.match(/puntos: (\d+)/)?.[1] || '';
          const image = productContainer.querySelector('img')?.src || '';

          return { name, price, priceValue, points, image };
        }, product.productId);

        // Combine all information
        const completeProduct = {
          ...basicInfo,
          productId: product.productId,
          ...productDetails
        };

        detailedProducts.push(completeProduct);
        console.log(`✓ Extracted details for: ${basicInfo.name}`);

        // Close modal (try multiple approaches)
        try {
          await page.click('.modal .close, .modal-header .close, .popup .close, [data-dismiss="modal"]');
        } catch (e) {
          // If close button doesn't work, try ESC key
          await page.keyboard.press('Escape');
        }
        
        // Wait for modal to close
        await new Promise(resolve => setTimeout(resolve, 1000));

      } catch (error) {
        console.log(`⚠️  Error processing ${product.name}: ${error.message}`);
        
        // Try to close any open modal and continue
        try {
          await page.keyboard.press('Escape');
          await new Promise(resolve => setTimeout(resolve, 1000));
        } catch (e) {}
      }
    }

    console.log(`\n✅ Successfully processed ${detailedProducts.length} products`);

    // Save detailed results
    fs.writeFileSync('products-detailed.json', JSON.stringify(detailedProducts, null, 2));
    console.log('Detailed products saved to products-detailed.json');

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
        .points { color: #27ae60; font-weight: bold; }
        .section { margin: 15px 0; }
        .section h4 { color: #34495e; margin: 10px 0 5px 0; }
        .section p { margin: 5px 0; }
        img { max-width: 200px; height: auto; float: right; margin: 0 0 10px 20px; }
        .debug { background: #f8f9fa; padding: 10px; margin: 10px 0; font-size: 0.9em; border-left: 4px solid #6c757d; }
    </style>
</head>
<body>
    <h1>🔍 Detailed Product Information - Fuxion Hidratación Saludable</h1>
    <p><strong>Total products analyzed:</strong> ${detailedProducts.length}</p>
    
    ${detailedProducts.map((product, index) => `
        <div class="product">
            <h3>${product.name || 'Unknown Product'}</h3>
            
            ${product.image ? `<img src="${product.image}" alt="${product.name}">` : ''}
            
            <div class="price">💰 Price: ${product.price || 'N/A'}</div>
            ${product.points ? `<div class="points">🏆 Points: ${product.points}</div>` : ''}
            
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
            
            ${product.allModalText ? `
                <div class="debug">
                    <h4>🔍 Modal Content (Debug)</h4>
                    <p>${product.allModalText.substring(0, 500)}${product.allModalText.length > 500 ? '...' : ''}</p>
                </div>
            ` : ''}
        </div>
    `).join('')}
</body>
</html>`;

    fs.writeFileSync('products-detailed-report.html', htmlReport);
    console.log('Enhanced HTML report saved to products-detailed-report.html');

  } catch (error) {
    console.error('Error occurred:', error);
  } finally {
    await browser.close();
  }
})();
