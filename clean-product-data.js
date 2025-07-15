import fs from 'fs';

// Read the detailed products data
const detailedData = JSON.parse(fs.readFileSync('products-with-details.json', 'utf8'));

console.log('🧹 Cleaning product data...');

const cleanedProducts = detailedData.products.map(product => {
  const details = product.detailPageData;
  
  // Extract only product-related images (filter out UI elements, flags, icons)
  const productImages = details.images.filter(img => {
    const src = img.src.toLowerCase();
    return (
      src.includes('productdetails') || 
      src.includes('productdataline') ||
      (src.includes('fuxionstorage') && !src.includes('icon'))
    ) && !src.includes('flag') && !src.includes('menu');
  });

  // Extract clean product information from detail sections
  const productSection = details.detailSections[product.name.toLowerCase()] || '';
  
  // Extract benefits section
  const benefits = details.detailSections['beneficios'] || '';
  
  // Extract preparation instructions
  const preparation = details.detailSections['preparación'] || '';
  
  // Extract consumption recommendations
  const consumption = details.detailSections['recomendación de consumo'] || '';

  // Parse the main product section to extract description and ingredients
  let description = '';
  let ingredients = '';
  let slogan = '';
  
  if (productSection) {
    // Extract slogan (usually in caps at the beginning)
    const sloganMatch = productSection.match(/¡([^!]+)!/);
    if (sloganMatch) {
      slogan = sloganMatch[1].trim();
    }
    
    // Extract description (text after "AGREGAR AL CARRITO")
    const descriptionMatch = productSection.match(/AGREGAR AL CARRITO\s+([^+]+?)(?:\s*\+|\s*$)/i);
    if (descriptionMatch) {
      description = descriptionMatch[1].trim().replace(/\s+/g, ' ');
    }
    
    // Extract ingredients (text with + symbols)
    const ingredientsMatch = productSection.match(/(\w+(?:\s+\w+)*(?:\s*\+\s*\w+(?:\s+\w+)*)+)/);
    if (ingredientsMatch) {
      ingredients = ingredientsMatch[1].replace(/\s*\+\s*/g, ', ').trim();
    }
  }

  // Extract price and points from the product section
  let price = details.productInfo.price || '';
  let points = '';
  const priceMatch = productSection.match(/CV:\s*([\d.]+)\s*([\d.]+)/);
  if (priceMatch) {
    points = priceMatch[1];
    price = priceMatch[2];
  }

  // Extract SKU
  let sku = '';
  const skuMatch = productSection.match(/SKU:\s*(\d+)/);
  if (skuMatch) {
    sku = skuMatch[1];
  }

  // Extract presentation info
  let presentation = '';
  const presentationMatch = productSection.match(/Presentaciones:\s*([^S]+?)(?:SKU|$)/);
  if (presentationMatch) {
    presentation = presentationMatch[1].trim();
  }

  return {
    id: product.id,
    name: product.name,
    slogan: slogan,
    description: description,
    ingredients: ingredients,
    benefits: benefits.replace(/\s+/g, ' ').trim(),
    preparation: preparation.replace(/\s+/g, ' ').trim(),
    consumption: consumption.replace(/\s+/g, ' ').trim(),
    price: price,
    points: points,
    sku: sku,
    presentation: presentation,
    images: productImages.map(img => ({
      url: img.src,
      alt: img.alt || product.name
    })),
    detailPageUrl: product.detailUrl,
    lastUpdated: product.scrapedAt
  };
});

// Create the final clean data structure
const cleanData = {
  metadata: {
    totalProducts: cleanedProducts.length,
    extractedAt: new Date().toISOString(),
    note: 'Clean product data with only essential information'
  },
  products: cleanedProducts
};

// Save the cleaned data
fs.writeFileSync('products-clean-final.json', JSON.stringify(cleanData, null, 2));

// Also create a super simple version for quick access
const simpleProducts = cleanedProducts.map(product => ({
  id: product.id,
  name: product.name,
  slogan: product.slogan,
  description: product.description,
  benefits: product.benefits,
  price: product.price,
  points: product.points,
  mainImage: product.images[0]?.url || '',
  detailPageUrl: product.detailPageUrl
}));

fs.writeFileSync('products-simple-clean.json', JSON.stringify(simpleProducts, null, 2));

console.log('✅ Clean product data created!');
console.log(`📊 Processed ${cleanedProducts.length} products`);
console.log('\n📁 Files created:');
console.log('  - products-clean-final.json (complete clean data)');
console.log('  - products-simple-clean.json (essential fields only)');

// Show summary of cleaned data
console.log('\n📋 Product Summary:');
cleanedProducts.forEach(product => {
  console.log(`\n🏷️  ${product.name} (${product.id})`);
  console.log(`   💰 Price: ${product.price}`);
  console.log(`   🏆 Points: ${product.points}`);
  console.log(`   📝 Slogan: ${product.slogan}`);
  console.log(`   🖼️  Images: ${product.images.length}`);
  console.log(`   📄 Has description: ${product.description ? 'Yes' : 'No'}`);
  console.log(`   ✨ Has benefits: ${product.benefits ? 'Yes' : 'No'}`);
  console.log(`   📋 Has preparation: ${product.preparation ? 'Yes' : 'No'}`);
});

console.log('\n🎉 Product data cleaning complete!');
