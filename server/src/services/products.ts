import db from '../database';
import type { NewProduct, Product } from '../models/product';

export function getAllProducts(): Product[] {
  return db
    .prepare('SELECT * FROM products ORDER BY id DESC')
    .all() as Product[];
}

export function getRecentProducts(): Product[] {
  return db
    .prepare('SELECT * FROM products ORDER BY id DESC LIMIT 8')
    .all() as Product[];
}

export function getProductsBySku(sku: string, excludeId = 0): Product[] {
  return db
    .prepare('SELECT * FROM products WHERE SKU LIKE ? AND id != ? ORDER BY id DESC LIMIT 5')
    .all(`%${sku}%`, excludeId) as Product[];
}

export function searchProducts(query: string): Product[] {
  const searchTerm = `%${query}%`;

  return db
    .prepare(`
      SELECT *
      FROM products
      WHERE title LIKE ? OR SKU LIKE ?
      ORDER BY id DESC
    `)
    .all(searchTerm, searchTerm) as Product[];
}

export function getProductById(id: number): Product | undefined {
  return db
    .prepare('SELECT * FROM products WHERE id = ?')
    .get(id) as Product | undefined;
}

export function createProduct(input: NewProduct): Product {
  const result = db
    .prepare(`
      INSERT INTO products (title, description, brand, SKU, price, imageurl, date)
      VALUES (?, ?, ?, ?, ?, ?, ?)
    `)
    .run(
      input.title,
      input.description,
      input.brand,
      input.SKU,
      input.price,
      input.imageurl,
      input.date
    );

  return getProductById(Number(result.lastInsertRowid)) as Product;
}

export function deleteProduct(id: number): boolean {
  const result = db.prepare('DELETE FROM products WHERE id = ?').run(id);
  return result.changes > 0;
}
