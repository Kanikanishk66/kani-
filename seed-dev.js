const { db } = require("./server/db");
const { id, now } = require("./server/core");

if (process.env.NODE_ENV === "production") {
  console.error("Development seed data is disabled in production.");
  process.exitCode = 1;
  db.close();
} else {
  try {
    const timestamp = now();
    const categorySeeds = [
      ["3D Objects", "3d-objects", "Product forms and spatial studies."],
      ["Digital Experiences", "digital-experiences", "Interfaces and visual systems."],
      ["Studio Editions", "studio-editions", "Selected poster and graphic editions."]
    ];
    for (const [name, slug, description] of categorySeeds) {
      db.prepare(`INSERT OR IGNORE INTO categories (id, name, slug, description, sort_order, created_at) VALUES (?, ?, ?, ?, ?, ?)`)
        .run(id(), name, slug, description, categorySeeds.findIndex(item => item[0] === name), timestamp);
    }
    const brandSeeds = [["Kani Studio", "kani-studio", "Original studio editions."], ["Vision Objects", "vision-objects", "Product and form studies."]];
    for (const [name, slug, description] of brandSeeds) {
      db.prepare(`INSERT OR IGNORE INTO brands (id, name, slug, description, created_at, updated_at) VALUES (?, ?, ?, ?, ?, ?)`)
        .run(id(), name, slug, description, timestamp, timestamp);
    }
    const products = [
      { sku: "KV-OBJ-001", name: "Aegis Drone Study", category: "3d-objects", brand: "Vision Objects", short: "A precision-machined drone form explored through layered materials.", description: "A studio product visualization exploring lightweight construction, disciplined surface transitions, and controlled lighting.", price: 14500, discount: 12900, stock: 8, image: "/assets/images/3d-stages-render.svg", features: ["Multi-material finish", "Detailed hard-surface geometry"], specs: { "Format": "Digital asset", "Render size": "4K" } },
      { sku: "KV-DIG-002", name: "Signal Interface Kit", category: "digital-experiences", brand: "Kani Studio", short: "A compact interface concept for clear, low-friction workflows.", description: "A reusable interface study focused on legible hierarchy, straightforward navigation, and a practical mobile layout.", price: 8200, discount: null, stock: 14, image: "/assets/images/project-02-mobile.svg", features: ["Mobile-first layouts", "Reusable components"], specs: { "Deliverable": "Figma source", "Screens": "12" } },
      { sku: "KV-EDT-003", name: "Orbit Poster Edition", category: "studio-editions", brand: "Kani Studio", short: "A limited visual edition built around scale, contrast, and orbital motion.", description: "An expressive poster concept prepared for high-quality print and digital display.", price: 3200, discount: 2800, stock: 20, image: "/assets/images/poster-01-events.svg", features: ["Print-ready artwork", "Digital format included"], specs: { "Ratio": "3:4", "Format": "Print + digital" } }
    ];
    for (const product of products) {
      const category = db.prepare("SELECT id FROM categories WHERE slug = ?").get(product.category);
      const existing = db.prepare("SELECT id FROM products WHERE sku = ?").get(product.sku);
      const productId = existing?.id || id();
      db.prepare(`INSERT OR IGNORE INTO products (id, sku, name, category_id, brand, short_description, description, specifications_json, features_json, tags_json,
        price_cents, discount_cents, tax_rate, stock_qty, low_stock_threshold, status, featured, created_at, updated_at)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 0, ?, 3, 'published', ?, ?, ?)`)
        .run(productId, product.sku, product.name, category.id, product.brand, product.short, product.description, JSON.stringify(product.specs), JSON.stringify(product.features), JSON.stringify([product.category, product.brand.toLowerCase()]), product.price * 100, product.discount === null ? null : product.discount * 100, product.stock, product.sku === "KV-OBJ-001" ? 1 : 0, timestamp, timestamp);
      if (!db.prepare("SELECT 1 FROM product_media WHERE product_id = ? LIMIT 1").get(productId)) {
        db.prepare(`INSERT INTO product_media (id, product_id, media_type, storage_key, alt_text, sort_order, mime_type, size_bytes, created_at)
          VALUES (?, ?, 'image', ?, ?, 0, 'image/svg+xml', 0, ?)`)
          .run(id(), productId, product.image, product.name, timestamp);
      }
    }
    console.log("Development catalog seed complete. No employee or customer accounts were created.");
  } catch (error) {
    console.error(error.message);
    process.exitCode = 1;
  } finally {
    db.close();
  }
}
