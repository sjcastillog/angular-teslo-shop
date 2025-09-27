import { Component, computed, inject, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { rxResource } from '@angular/core/rxjs-interop';
import { PaginationService } from '@/shared/components/pagination/pagination.service';
import { ProductTableComponent } from '@/produtcs/components/product-table/product-table.component';
import { ProductsService } from '@/produtcs/services/products.service';
import { PaginationComponent } from '@/shared/components/pagination/pagination.component';

@Component({
  selector: 'app-products-admin-page',
  imports: [ProductTableComponent, PaginationComponent, RouterLink],
  templateUrl: './products-admin-page.component.html',
})
export class ProductsAdminPageComponent {
  productsService = inject(ProductsService);

  paginationService = inject(PaginationService);

  productsPerPage = signal(10);
  

  get currentPage() {
    return this.paginationService.currentPage();
  }

  productsResource = rxResource({
    params: () => ({ limit:this.productsPerPage(), page: this.currentPage - 1 }),
    stream: ({ request }: any) => {
      return this.productsService.getProducts({
        limit: request.limit,
        offset: request.page * 9,
      });
    },
  });

  products = computed(() => this.productsResource.value()?.products ?? []);
}
