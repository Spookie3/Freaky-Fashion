import { Component, signal } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-footer',
  imports: [RouterLink],
  templateUrl: './footer.html',
  styleUrl: './footer.css'
})
export class Footer {
  readonly linkLabels: Record<string, string> = {
    Vinterjackor: 'Winter jackets', Pufferjackor: 'Puffer jackets', Kappa: 'Coats', Trenchcoats: 'Trench coats'
  };
  readonly categories = [
    { id: 'shopping', title: 'Shopping', links: ['Vinterjackor', 'Pufferjackor', 'Kappa', 'Trenchcoats'] },
    { id: 'account', title: 'My pages', links: ['My orders', 'My account'] },
    { id: 'support', title: 'Customer service', links: ['Return policy', 'Privacy policy'] }
  ];
  readonly expanded = signal<Record<string, boolean>>({ shopping: true, account: false, support: false });

  toggle(id: string): void {
    this.expanded.update((state) => ({ ...state, [id]: !state[id] }));
  }
}

