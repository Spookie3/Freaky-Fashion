import Database from 'better-sqlite3';

const db = new Database('productDatabase.db');

db.exec(`
  CREATE TABLE IF NOT EXISTS products (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    title TEXT NOT NULL,
    price INTEGER NOT NULL,
    imageurl TEXT NOT NULL,
    SKU TEXT NOT NULL
    )
`);

export default db;