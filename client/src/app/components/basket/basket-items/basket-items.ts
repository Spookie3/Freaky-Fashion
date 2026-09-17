import { Component, Input, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { BasketService } from '../../../services/basket';

@Component({
  selector: 'app-basket-items',
  imports: [RouterLink],
  templateUrl: './basket-items.html',
  styleUrl: './basket-items.css',
  host: { class: 'block' }
})
export class BasketItems {
  @Input() readonly = false;
  readonly basket = inject(BasketService);

  changeQuantity(id: number, event: Event): void {
    const input = event.target as HTMLInputElement;
    this.basket.setQuantity(id, input.valueAsNumber);
    input.value = String(this.basket.items().find((item) => item.id === id)?.quantity ?? 1);
  }
}
