import Database from 'better-sqlite3';

const db = new Database('productDatabase.db');

db.exec(`
  CREATE TABLE IF NOT EXISTS products (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    title TEXT NOT NULL,
    description TEXT NOT NULL DEFAULT '',
    brand TEXT NOT NULL DEFAULT '',
    price INTEGER NOT NULL,
    imageurl TEXT NOT NULL,
    SKU TEXT NOT NULL,
    date TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
    )
`);

export default db;
