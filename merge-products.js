import fs from 'fs';

// Read existing data files
const basicProducts = JSON.parse(fs.readFileSync('products.json', 'utf8'));
const detailedProducts = JSON.parse(fs.readFileSync('products-detailed-clean.json', 'utf8'));

// Create a map of detailed products by ID for easy lookup
const detailedMap = {};
detailedProducts.forEach(product => {
  detailedMap[product.id] = product;
});

// Merge the data
const mergedProducts = [];

// Map to track unique products and their variants
const productMap = {};

basicProducts.forEach((basic, index) => {
  // Find corresponding detailed product by finding matching name and price
  const detailed = detailedProducts.find(d => 
    d.name === basic.name && d.price === basic.price
  );

  // Extract size information from image filename for better variant identification
  const imageSizeMatch = basic.image.match(/(\d+x\d+)/);
  const packageSize = imageSizeMatch ? imageSizeMatch[1] : '';

  // Create product key for grouping variants
  const baseProductName = basic.name.replace(/\s+(CAJA|BOX).*/, '');
  
  const mergedProduct = {
    id: detailed ? detailed.id : `unknown_${index}`,
    name: basic.name,
    baseProductName: baseProductName,
    price: {
      display: basic.price,
      value: parseFloat(basic.priceValue.replace(',', '.')),
      currency: 'ARS'
    },
    points: parseInt(basic.points) || 0,
    image: {
      main: basic.image,
      alt: basic.name
    },
    packageInfo: {
      size: packageSize,
      description: basic.name.includes('CAJA') ? basic.name.split('CAJA')[1]?.trim() : ''
    },
    urls: {
      detailPage: detailed ? detailed.detailUrl : null
    },
    metadata: {
      scraped: new Date().toISOString(),
      source: 'ifuxion.com',
      category: 'hidratacion-saludable'
    },
    // Additional fields from detail scraping (limited due to auth requirements)
    detailInfo: {
      description: detailed ? detailed.description : '',
      benefits: detailed ? detailed.benefits : '',
      usage: detailed ? detailed.usage : '',
      pageTitle: detailed ? detailed.pageTitle : ''
    }
  };

  // Group products by base name for better organization
  if (!productMap[baseProductName]) {
    productMap[baseProductName] = {
      productName: baseProductName,
      variants: []
    };
  }
  
  productMap[baseProductName].variants.push(mergedProduct);
  mergedProducts.push(mergedProduct);
});

// Create final structured data
const finalData = {
  metadata: {
    totalProducts: mergedProducts.length,
    uniqueProductLines: Object.keys(productMap).length,
    scrapedAt: new Date().toISOString(),
    source: {
      website: 'ifuxion.com',
      category: 'hidratacion-saludable',
      enrollmentPath: '/hidratacionsaludable/enrollment/products'
    },
    priceRange: {
      min: Math.min(...mergedProducts.map(p => p.price.value)),
      max: Math.max(...mergedProducts.map(p => p.price.value)),
      currency: 'ARS'
    },
    pointsRange: {
      min: Math.min(...mergedProducts.map(p => p.points)),
      max: Math.max(...mergedProducts.map(p => p.points))
    }
  },
  productLines: productMap,
  allProducts: mergedProducts.sort((a, b) => a.price.value - b.price.value) // Sort by price
};

// Save the merged data
fs.writeFileSync('products-complete.json', JSON.stringify(finalData, null, 2));

// Also create a simplified version for easy use
const simplifiedProducts = mergedProducts.map(product => ({
  id: product.id,
  name: product.name,
  price: product.price.display,
  priceValue: product.price.value,
  points: product.points,
  image: product.image.main,
  detailUrl: product.urls.detailPage
}));

fs.writeFileSync('products-simple.json', JSON.stringify(simplifiedProducts, null, 2));

console.log('✅ Data successfully merged!');
console.log(`📊 Total products: ${finalData.metadata.totalProducts}`);
console.log(`🏷️  Unique product lines: ${finalData.metadata.uniqueProductLines}`);
console.log(`💰 Price range: $${finalData.metadata.priceRange.min} - $${finalData.metadata.priceRange.max}`);
console.log(`🏆 Points range: ${finalData.metadata.pointsRange.min} - ${finalData.metadata.pointsRange.max}`);
console.log('\n📁 Files created:');
console.log('  - products-complete.json (full structured data)');
console.log('  - products-simple.json (simplified format)');

// Show product lines summary
console.log('\n🏷️  Product Lines:');
Object.entries(productMap).forEach(([name, data]) => {
  console.log(`  - ${name}: ${data.variants.length} variant(s)`);
});
