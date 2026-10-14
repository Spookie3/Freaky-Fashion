export interface Product {
  id: number;
  title: string;
  description: string;
  brand: string;
  price: number;
  imageurl: string;
  SKU: string;
  date: string;
}

export interface CreateProductBody {
  title?: unknown;
  description?: unknown;
  brand?: unknown;
  SKU?: unknown;
  price?: unknown;
  imageurl?: unknown;
  date?: unknown;
}

export interface NewProduct {
  title: string;
  description: string;
  brand: string;
  SKU: string;
  price: number;
  imageurl: string;
  date: string;
}
