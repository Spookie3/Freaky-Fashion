import { Component } from '@angular/core';
import { BasketItems } from '../../components/basket/basket-items/basket-items';
import { Navigation } from "../../components/navigation/navigation";
import { Footer } from "../../components/footer/footer";

@Component({
  imports: [Navigation, Footer, BasketItems],
  selector: 'app-basket',
  styleUrl: './basket.css',
  templateUrl: './basket.html',
})
export class Basket {}
