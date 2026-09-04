export interface Product {
  id: number;
  title: string;
  price: number;
  imageurl: string;
  SKU: string;
}

export interface CreateProductBody {
  title?: unknown;
  SKU?: unknown;
  price?: unknown;
  imageurl?: unknown;
}

export interface NewProduct {
  title: string;
  SKU: string;
  price: number;
  imageurl: string;
}
