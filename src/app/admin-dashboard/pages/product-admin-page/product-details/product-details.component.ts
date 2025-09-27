import { Component, computed, inject, input, OnInit, signal } from '@angular/core';
import { Product } from '@/produtcs/interfaces/product.interface';
import { ProductCarouselComponent } from '@/produtcs/components/product-carousel/product-carousel.component';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { FormUtils } from '@/utils/form-utils';
import { FormErrorLabelComponent } from '@/shared/components/form-error-label/form-error-label.component';
import { ProductsService } from '@/produtcs/services/products.service';
import { Router } from '@angular/router';
import { firstValueFrom } from 'rxjs';

@Component({
  selector: 'product-details',
  imports: [ProductCarouselComponent, ReactiveFormsModule, FormErrorLabelComponent],
  templateUrl: './product-details.component.html',
})
export class ProductDetailsComponent implements OnInit {
  product = input.required<Product>();

  router = inject(Router);
  fb = inject(FormBuilder);
  productsService = inject(ProductsService);

  wasSave = signal(false);
  tempImages = signal<string[]>([]);
  imageFileList: FileList | undefined = undefined;

  imagesToCarrousel = computed(() => {
    const currentProductImages = [...this.product().images, ...this.tempImages()];

    return currentProductImages;
  });

  productForm = this.fb.group({
    title: ['', Validators.required],
    description: ['', Validators.required],
    tags: [''],
    slug: ['', [Validators.required, Validators.pattern(FormUtils.slugPattern)]],
    price: ['', [Validators.required, Validators.min(0)]],
    stock: ['', [Validators.required, Validators.min(0)]],
    sizes: [['']],
    images: [[]],
    gender: ['men', [Validators.required, Validators.pattern(/men|women|kid|unisex/)]],
  });

  sizes = ['XS', 'S', 'M', 'L', 'LG', 'XL'];

  ngOnInit(): void {
    this.setFormValue(this.product());
  }

  setFormValue(formLike: Partial<Product>) {
    // patchValue es parecido al reset
    this.productForm.patchValue(formLike as any);
    this.productForm.patchValue({ tags: formLike.tags?.join(',') });
  }

  onSizeClicked(size: string) {
    const currentSizes = this.productForm.value.sizes ?? [];
    if (currentSizes.includes(size)) {
      currentSizes.splice(currentSizes.indexOf(size), 1);
    } else {
      currentSizes.push(size);
    }

    this.productForm.patchValue({ sizes: currentSizes });
  }

  async onSubmit() {
    const isValid = this.productForm.valid;
    if (!isValid) return;

    const formValue = this.productForm.value;

    const productLike: Partial<Product> = {
      ...(formValue as any),
      tags:
        formValue.tags
          ?.toLocaleLowerCase()
          .split(',')
          .map((tag) => tag.trim()) ?? [],
    };

    if (this.product().id === 'new') {
      const product = await firstValueFrom(this.productsService.createProduct(productLike, this.imageFileList));
      this.router.navigate(['/admin/products', product.id]);
    } else {
      await firstValueFrom(this.productsService.updateProduct(this.product().id, productLike, this.imageFileList));
    }
    this.wasSave.set(true);
    setTimeout(() => {
      this.wasSave.set(false);
    }, 2000);
  }

  onFilesChanged(event: Event) {
    const fileList = (event.target as HTMLInputElement).files;

    this.imageFileList = fileList ?? undefined;

    // Creamos las vistas previas
    const imageUrl = Array.from(fileList ?? []).map((file) => URL.createObjectURL(file));

    this.tempImages.set(imageUrl);
  }
}
