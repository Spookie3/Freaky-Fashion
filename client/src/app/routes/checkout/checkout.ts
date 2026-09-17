import { Component } from '@angular/core';
import { BasketItems } from '../../components/basket/basket-items/basket-items';
import { CheckoutForm } from '../../components/checkout/checkout-form/checkout-form';
import { Navigation } from "../../components/navigation/navigation";
import { Footer } from "../../components/footer/footer";

@Component({
  imports: [Navigation, Footer, BasketItems, CheckoutForm],
  selector: 'app-checkout',
  styleUrl: './checkout.css',
  templateUrl: './checkout.html',
})
export class Checkout {}
