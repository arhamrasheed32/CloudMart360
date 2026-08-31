import { dbService } from './db.js';

export const INITIAL_PRODUCTS = [
  {
    id: 'prod-001-aura-pro',
    name: 'Aura Pro Noise Cancelling Headphones',
    sku: 'CM-ELE-AUR-9021',
    category: 'Electronics',
    brand: 'AcoustiCloud',
    price: 249.99,
    costPrice: 110.00,
    stock: 30,
    minStockThreshold: 10,
    status: 'active',
    description: 'Precision-tuned active noise cancelling over-ear headphones with 40mm bio-cellulose drivers, 40-hour battery life, and ultra-plush memory foam earcups.',
    imageUrl: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800&q=80',
    tags: ['wireless', 'noise-cancelling', 'premium', 'audio'],
    hasVariants: true,
    options: [
      { name: 'Color', values: ['Matte Black', 'Silver Frost', 'Midnight Blue'] },
      { name: 'Edition', values: ['Standard', 'Pro Studio'] }
    ],
    variants: [
      {
        id: 'var-aura-blk-std',
        sku: 'CM-ELE-AUR-BLK-STD',
        title: 'Matte Black / Standard',
        attributes: { Color: 'Matte Black', Edition: 'Standard' },
        price: 249.99,
        costPrice: 110.00,
        stock: 12
      },
      {
        id: 'var-aura-blk-pro',
        sku: 'CM-ELE-AUR-BLK-PRO',
        title: 'Matte Black / Pro Studio',
        attributes: { Color: 'Matte Black', Edition: 'Pro Studio' },
        price: 289.99,
        costPrice: 128.00,
        stock: 8
      },
      {
        id: 'var-aura-slv-std',
        sku: 'CM-ELE-AUR-SLV-STD',
        title: 'Silver Frost / Standard',
        attributes: { Color: 'Silver Frost', Edition: 'Standard' },
        price: 249.99,
        costPrice: 110.00,
        stock: 6
      },
      {
        id: 'var-aura-mid-pro',
        sku: 'CM-ELE-AUR-MID-PRO',
        title: 'Midnight Blue / Pro Studio',
        attributes: { Color: 'Midnight Blue', Edition: 'Pro Studio' },
        price: 289.99,
        costPrice: 128.00,
        stock: 4
      }
    ],
    createdAt: '2026-08-01T08:30:00.000Z',
    updatedAt: '2026-08-25T14:10:00.000Z'
  },
  {
    id: 'prod-002-c3d4',
    name: 'UltraLite Smart Fitness Watch Series 5',
    sku: 'CM-ELE-WAT-4812',
    category: 'Electronics',
    brand: 'PulseTech',
    price: 189.50,
    costPrice: 78.20,
    stock: 8,
    minStockThreshold: 15,
    status: 'active',
    description: 'Next-gen biometric smartwatch with continuous ECG, SpO2 blood oxygen tracking, GPS navigation, and 7-day titanium battery enclosure.',
    imageUrl: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=500&q=80',
    tags: ['wearable', 'fitness', 'smartwatch'],
    createdAt: new Date(Date.now() - 25 * 24 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString()
  },
  {
    id: 'prod-003-e5f6',
    name: 'Merino Wool Ergonomic Tech Hoodie',
    sku: 'CM-APP-MER-1193',
    category: 'Apparel & Fashion',
    brand: 'Vanguard Apparel',
    price: 128.00,
    costPrice: 42.50,
    stock: 64,
    minStockThreshold: 12,
    status: 'active',
    description: 'Thermally adaptive 100% superfine Australian Merino wool with hidden zippered EDC compartments and moisture-wicking anti-odor finish.',
    imageUrl: 'https://images.unsplash.com/photo-1556905055-8f358a7a47b2?w=500&q=80',
    tags: ['apparel', 'merino', 'comfort'],
    createdAt: new Date(Date.now() - 20 * 24 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000).toISOString()
  },
  {
    id: 'prod-004-g7h8',
    name: 'Precision Barista Electric Gooseneck Kettle',
    sku: 'CM-HOM-BAR-7734',
    category: 'Home & Kitchen',
    brand: 'Artisan Roast',
    price: 155.00,
    costPrice: 65.00,
    stock: 19,
    minStockThreshold: 8,
    status: 'active',
    description: 'PID temperature control kettle with +/- 1 degree accuracy, LCD real-time thermometer, count-up brew stopwatch, and food-grade 304 stainless body.',
    imageUrl: 'https://images.unsplash.com/photo-1570968915860-54d5c301fa9f?w=500&q=80',
    tags: ['kitchen', 'coffee', 'barista'],
    createdAt: new Date(Date.now() - 18 * 24 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString()
  },
  {
    id: 'prod-005-i9j0',
    name: 'HyperGrip Carbon Trail Running Shoes',
    sku: 'CM-SPO-HYP-3301',
    category: 'Sports & Outdoors',
    brand: 'Apex Outdoor',
    price: 175.00,
    costPrice: 68.00,
    stock: 5,
    minStockThreshold: 10,
    status: 'active',
    description: 'Engineered with dual-density Vibram Megagrip outsoles, full-length carbon fiber propulsion plate, and breathable Kevlar-reinforced ballistic upper mesh.',
    imageUrl: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=500&q=80',
    tags: ['footwear', 'trail', 'carbon'],
    createdAt: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString()
  },
  {
    id: 'prod-006-k1l2',
    name: 'Botanical Radiance Anti-Aging Peptide Serum',
    sku: 'CM-HEA-BOT-6629',
    category: 'Health & Beauty',
    brand: 'Lumina Derma',
    price: 84.00,
    costPrice: 18.50,
    stock: 0,
    minStockThreshold: 10,
    status: 'active',
    description: 'Clinical grade serum featuring 5% multi-molecular hyaluronic acid, Matrixyl 3000 peptides, and cold-pressed botanical squalane.',
    imageUrl: 'https://images.unsplash.com/photo-1620916566398-39f1143ab7be?w=500&q=80',
    tags: ['skincare', 'organic', 'beauty'],
    createdAt: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString()
  },
  {
    id: 'prod-007-m3n4',
    name: 'Minimalist Top-Grain Leather Cardholder',
    sku: 'CM-ACC-LEA-8810',
    category: 'Accessories',
    brand: 'Horween Craft',
    price: 48.00,
    costPrice: 14.00,
    stock: 92,
    minStockThreshold: 20,
    status: 'active',
    description: 'Handcrafted Vegetable-tanned Italian bridle leather cardholder with RFID blocking inner brass lining and hand-burnished edges.',
    imageUrl: 'https://images.unsplash.com/photo-1627123424574-724758594e93?w=500&q=80',
    tags: ['leather', 'wallet', 'edc'],
    createdAt: new Date(Date.now() - 12 * 24 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date(Date.now() - 6 * 24 * 60 * 60 * 1000).toISOString()
  },
  {
    id: 'prod-008-o5p6',
    name: 'Quantum 4K Ultra-Wide Curved Monitor 34"',
    sku: 'CM-ELE-MON-9952',
    category: 'Electronics',
    brand: 'VividVision',
    price: 649.99,
    costPrice: 380.00,
    stock: 14,
    minStockThreshold: 5,
    status: 'active',
    description: '34-inch 144Hz Nano-IPS curved ultrawide with 98% DCI-P3 color gamut, USB-C 90W power delivery, and factory color calibration certificate.',
    imageUrl: 'https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?w=500&q=80',
    tags: ['monitor', 'gaming', '4k', 'usb-c'],
    createdAt: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString()
  },
  {
    id: 'prod-009-q7r8',
    name: 'Organic Single-Origin Yirgacheffe Coffee Beans (1kg)',
    sku: 'CM-GRO-YIR-5511',
    category: 'Groceries',
    brand: 'Highland Specialty',
    price: 34.50,
    costPrice: 12.00,
    stock: 0,
    minStockThreshold: 15,
    status: 'draft',
    description: 'Washed process Ethiopian Grade 1 specialty coffee beans with prominent notes of bergamot, jasmine blossoms, and sweet Meyer lemon.',
    imageUrl: 'https://images.unsplash.com/photo-1587734195503-904fca47e0e9?w=500&q=80',
    tags: ['coffee', 'organic', 'specialty'],
    createdAt: new Date(Date.now() - 8 * 24 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString()
  },
  {
    id: 'prod-010-s9t0',
    name: 'Acoustic Wool Wall Panels - Pack of 8 (Hexagon)',
    sku: 'CM-HOM-ACO-2287',
    category: 'Home & Kitchen',
    brand: 'Nordic Quiet',
    price: 119.00,
    costPrice: 38.00,
    stock: 31,
    minStockThreshold: 10,
    status: 'active',
    description: 'High-density NRC 0.95 acoustic sound absorption panels crafted from recycled PET felt with self-adhesive 3M backing.',
    imageUrl: 'https://images.unsplash.com/photo-1513694203232-719a280e022f?w=500&q=80',
    tags: ['home', 'acoustic', 'decor'],
    createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString()
  },
  {
    id: 'prod-011-u1v2',
    name: 'Aerospace Titanium Fountain Pen - Midnight Black',
    sku: 'CM-BOO-PEN-3390',
    category: 'Books & Stationery',
    brand: 'Karas Studio',
    price: 95.00,
    costPrice: 32.00,
    stock: 22,
    minStockThreshold: 5,
    status: 'active',
    description: 'CNC machined Grade 5 titanium body with DLC diamond-like coating, German Schmidt medium steel nib, and standard international piston converter.',
    imageUrl: 'https://images.unsplash.com/photo-1583485088034-697b5bc54ccd?w=500&q=80',
    tags: ['stationery', 'titanium', 'luxury'],
    createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString()
  },
  {
    id: 'prod-012-w3x4',
    name: 'Smart WiFi Aroma Diffuser with RGB Ambient Light',
    sku: 'CM-HOM-DIF-7019',
    category: 'Home & Kitchen',
    brand: 'AuraHome',
    price: 49.99,
    costPrice: 16.50,
    stock: 3,
    minStockThreshold: 10,
    status: 'active',
    description: '500ml ultrasonic essential oil diffuser with Alexa/Google Assistant voice integration, customizable RGB ambient lighting, and auto-shutoff sensor.',
    imageUrl: 'https://images.unsplash.com/photo-1608571423902-eed4a5ad8108?w=500&q=80',
    tags: ['smart-home', 'diffuser', 'ambient'],
    createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date().toISOString()
  }
];

export async function runSeed() {
  console.log('[Seed] Populating initial CloudMart 360 Product Catalog...');
  const count = await dbService.seedProducts(INITIAL_PRODUCTS);
  console.log(`[Seed] Successfully initialized ${count} products in DynamoDB/Database!`);
  return count;
}

if (process.argv[1] && process.argv[1].endsWith('seed.js')) {
  runSeed().catch(err => {
    console.error('[Seed] Error seeding products:', err);
    process.exit(1);
  });
}
