import puppeteer from 'puppeteer';
import fs from 'fs';

(async () => {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();

  try {
    console.log('Navigating to the page...');
    
    // Navigate to the page
    await page.goto('https://ifuxion.com/NANCYSASTRE/enrollment/products', {
      waitUntil: 'networkidle2',
      timeout: 30000
    });

    console.log('Extracting product data...');

    // Extract complete product information
    const products = await page.evaluate(() => {
      const productData = [];
      
      // Look for product containers - they seem to contain price spans
      const priceElements = document.querySelectorAll('.price.colorTheme');
      
      priceElements.forEach(priceEl => {
        // Navigate up the DOM to find the product container
        let productContainer = priceEl.closest('.col-md-4') || priceEl.closest('.product') || priceEl.closest('div');
        
        if (productContainer) {
          // Extract product information
          const name = productContainer.querySelector('h3')?.textContent?.trim() || 
                      productContainer.querySelector('h4')?.textContent?.trim() || 
                      productContainer.querySelector('.title')?.textContent?.trim() ||
                      productContainer.querySelector('strong')?.textContent?.trim() ||
                      'Unknown Product';
          
          const price = priceEl.textContent?.trim();
          const priceValue = productContainer.querySelector('.priceProduct')?.value;
          
          // Look for description or additional info
          const description = productContainer.querySelector('.description')?.textContent?.trim() ||
                             productContainer.querySelector('p')?.textContent?.trim() ||
                             '';
          
          // Look for points
          const pointsEl = productContainer.querySelector('.pointProduct');
          const points = pointsEl?.value || productContainer.querySelector('.number')?.textContent?.match(/puntos: (\\d+)/)?.[1];
          
          // Look for image
          const imageEl = productContainer.querySelector('img');
          const image = imageEl?.src || imageEl?.getAttribute('data-src') || '';
          
          productData.push({
            name: name,
            price: price,
            priceValue: priceValue,
            points: points,
            description: description.substring(0, 200), // Limit description length
            image: image
          });
        }
      });
      
      return productData;
    });

    console.log(`Found ${products.length} products:`);
    console.log(JSON.stringify(products, null, 2));

    // Save to JSON file
    fs.writeFileSync('products.json', JSON.stringify(products, null, 2));
    console.log('\nProducts saved to products.json');

    // Create a simple HTML report
    const htmlReport = `
<!DOCTYPE html>
<html>
<head>
    <title>Scraped Products</title>
    <style>
        body { font-family: Arial, sans-serif; margin: 20px; }
        .product { border: 1px solid #ddd; margin: 10px 0; padding: 15px; border-radius: 5px; }
        .product h3 { margin-top: 0; color: #333; }
        .price { font-size: 1.2em; font-weight: bold; color: #e74c3c; }
        .points { color: #27ae60; }
        img { max-width: 200px; height: auto; }
    </style>
</head>
<body>
    <h1>Scraped Products from Fuxion</h1>
    <p>Total products found: ${products.length}</p>
    ${products.map(product => `
        <div class="product">
            <h3>${product.name}</h3>
            ${product.image ? `<img src="${product.image}" alt="${product.name}">` : ''}
            <p class="price">Price: ${product.price}</p>
            ${product.points ? `<p class="points">Points: ${product.points}</p>` : ''}
            ${product.description ? `<p>Description: ${product.description}</p>` : ''}
        </div>
    `).join('')}
</body>
</html>`;

    fs.writeFileSync('products-report.html', htmlReport);
    console.log('HTML report saved to products-report.html');

  } catch (error) {
    console.error('Error occurred:', error);
  } finally {
    await browser.close();
  }
})();
