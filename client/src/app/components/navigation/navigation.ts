import { Component, inject } from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';

@Component({
  selector: 'app-navigation',
  imports: [ReactiveFormsModule, RouterLink],
  templateUrl: './navigation.html',
  styleUrl: './navigation.css'
})
export class Navigation {
  private readonly router = inject(Router);

  readonly searchTerm = new FormControl('', { nonNullable: true });

  search(): void {
    const query = this.searchTerm.value.trim();

    if (!query) {
      return;
    }

    void this.router.navigate(['/search'], { queryParams: { q: query } });
  }
}
