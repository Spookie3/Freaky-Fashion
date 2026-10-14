import { Routes } from '@angular/router';
import { Search } from './routes/search/search';
import { Admin } from './routes/admin/admin';
import { Basket } from './routes/basket/basket';
import { Checkout } from './routes/checkout/checkout';
import { Products } from './routes/products/products';
import { Start } from './routes/start/start';
import { ProductsTable } from './components/admin/products-table/products-table';
import { AdminForm } from './components/admin/admin-form/admin-form';

export const routes: Routes = [
  { 
    path: '', 
    redirectTo: 'start', 
    pathMatch: 'full' 
  },
  { 
    path: 'start',
    component: Start
  },
  { 
    path: 'products',
    component: Products
  },
  {
    path: 'products/:slug',
    component: Products
  },
  {
    path: 'search',
    component: Search
  },
  { 
    path: 'basket',
    component: Basket
  },
  { 
    path: 'checkout',
    component: Checkout
  },
  { 
    path: 'admin',
    component: Admin,
    children: [
      {
        path: '',
        component: ProductsTable
      },
      {
        path: 'new',
        component: AdminForm
      }
    ]
  }
];
