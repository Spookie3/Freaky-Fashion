import { HttpErrorResponse } from '@angular/common/http';
import { Component, inject } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ProductService } from '../../../services/product';

@Component({
  imports: [ReactiveFormsModule],
  selector: 'app-admin-form',
  styleUrl: './admin-form.css',
  templateUrl: './admin-form.html',
})
export class AdminForm {
  private readonly productService = inject(ProductService);

  submitted = false;
  isSubmitting = false;
  successMessage = '';
  errorMessage = '';

  readonly productForm = new FormGroup({
    title: new FormControl('', {
      nonNullable: true,
      validators: [Validators.required]
    }),
    description: new FormControl('', {
      nonNullable: true,
      validators: [Validators.required]
    }),
    imageurl: new FormControl('', {
      nonNullable: true,
      validators: [Validators.required]
    }),
    brand: new FormControl('', {
      nonNullable: true,
      validators: [Validators.required]
    }),
    SKU: new FormControl('', {
      nonNullable: true,
      validators: [Validators.required, Validators.pattern(/^[A-Za-z]{3}\d{3}$/)]
    }),
    price: new FormControl<number | null>(null, {
      validators: [Validators.required, Validators.min(0)]
    }),
    date: new FormControl('', {
      nonNullable: true,
      validators: [Validators.required]
    })
  });

  onSubmit(): void {
    this.submitted = true;

    if (this.productForm.invalid) {
      this.productForm.markAllAsTouched();
      return;
    }

    const product = this.productForm.getRawValue();

    if (product.price === null) {
      return;
    }

    this.isSubmitting = true;
    this.successMessage = '';
    this.errorMessage = '';

    this.productService.createProduct({ ...product, price: product.price }).subscribe({
      next: (createdProduct) => {
        this.successMessage = `${createdProduct.title} was added successfully.`;
        this.productForm.reset();
        this.submitted = false;
        this.isSubmitting = false;
      },
      error: (error: HttpErrorResponse) => {
        this.errorMessage = error.error?.message ?? 'The product could not be added.';
        this.isSubmitting = false;
      }
    });
  }
}
