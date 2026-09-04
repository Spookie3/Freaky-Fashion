import express from 'express';
import type { CreateProductBody } from '../models/product';
import {
  createProduct,
  deleteProduct,
  getProductById,
  getProductsBySku,
  getRecentProducts,
  searchProducts
} from '../services/products';

const router = express.Router();

// Get the eight most recently added products.
router.get('/recent', (_req, res) => {
  res.json(getRecentProducts());
});

// Get up to five products whose SKU contains the supplied value.
router.get('/sku/:sku', (req, res) => {
  res.json(getProductsBySku(req.params.sku));
});

// Get every product whose title or SKU contains the search term.
// Example: GET /api/products/search?q=shirt
router.get('/search', (req, res) => {
  const query = typeof req.query.q === 'string' ? req.query.q.trim() : '';

  if (!query) {
    res.status(400).json({ message: 'The q search parameter is required' });
    return;
  }

  res.json(searchProducts(query));
});

// Get one product by id.
router.get('/:id', (req, res) => {
  const id = Number(req.params.id);

  if (!Number.isInteger(id) || id <= 0) {
    res.status(400).json({ message: 'Invalid product id' });
    return;
  }

  const product = getProductById(id);

  if (!product) {
    res.status(404).json({ message: 'Product not found' });
    return;
  }

  res.json(product);
});

// Create a product.
router.post('/', (req, res) => {
  const { title, SKU, price, imageurl } = req.body as CreateProductBody;

  if (
    typeof title !== 'string' || !title.trim() ||
    typeof SKU !== 'string' || !SKU.trim() ||
    typeof price !== 'number' || !Number.isFinite(price) || price < 0 ||
    typeof imageurl !== 'string' || !imageurl.trim()
  ) {
    res.status(400).json({
      message: 'title, SKU, a non-negative numeric price, and imageurl are required'
    });
    return;
  }

  const product = createProduct({
    title: title.trim(),
    SKU: SKU.trim(),
    price,
    imageurl: imageurl.trim()
  });

  res.status(201).json(product);
});

// Delete one product by id.
router.delete('/:id', (req, res) => {
  const id = Number(req.params.id);

  if (!Number.isInteger(id) || id <= 0) {
    res.status(400).json({ message: 'Invalid product id' });
    return;
  }

  if (!deleteProduct(id)) {
    res.status(404).json({ message: 'Product not found' });
    return;
  }

  res.status(204).send();
});


export default router;
