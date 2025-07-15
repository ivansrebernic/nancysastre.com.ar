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

    console.log('Page loaded, taking screenshot...');
    await page.screenshot({ path: 'page-screenshot.png' });

    console.log('Getting page title and URL...');
    const title = await page.title();
    const url = await page.url();
    console.log(`Title: ${title}`);
    console.log(`Final URL: ${url}`);

    // Save the page HTML for inspection
    const html = await page.content();
    fs.writeFileSync('page-content.html', html);
    console.log('Page HTML saved to page-content.html');

    // Look for common product selectors
    const possibleSelectors = [
      '.product',
      '.product-item',
      '.product-card',
      '[data-product]',
      '.item',
      '.card',
      '.listing-item',
      '.shop-item'
    ];

    console.log('\nChecking for product elements...');
    for (const selector of possibleSelectors) {
      const count = await page.$$eval(selector, elements => elements.length);
      if (count > 0) {
        console.log(`Found ${count} elements with selector: ${selector}`);
      }
    }

    // Try to extract any product-like information
    const products = await page.evaluate(() => {
      const allElements = document.querySelectorAll('*');
      const productData = [];
      
      // Look for elements containing price-like text
      allElements.forEach(el => {
        const text = el.textContent?.trim();
        if (text && (text.includes('$') || text.includes('€') || text.includes('£') || /\d+[.,]\d+/.test(text))) {
          if (text.length < 200) { // Avoid large text blocks
            productData.push({
              tagName: el.tagName,
              className: el.className,
              id: el.id,
              text: text
            });
          }
        }
      });
      
      return productData.slice(0, 20); // Limit to first 20 findings
    });

    console.log('\nPossible product/price elements found:');
    console.log(JSON.stringify(products, null, 2));

  } catch (error) {
    console.error('Error occurred:', error);
  } finally {
    await browser.close();
  }
})();

