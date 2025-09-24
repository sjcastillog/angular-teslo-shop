import { ProductCardComponent } from '@/produtcs/components/product-card/product-card.component';
import { ProductsService } from '@/produtcs/services/products.service';
import { Component, inject } from '@angular/core';
import { rxResource, toSignal } from '@angular/core/rxjs-interop';
import { PaginationComponent } from "@/shared/components/pagination/pagination.component";
import { ActivatedRoute } from '@angular/router';
import { map } from 'rxjs';
import { PaginationService } from '@/shared/components/pagination/pagination.service';

@Component({
  selector: 'app-home-page',
  imports: [ProductCardComponent, PaginationComponent],
  templateUrl: './home-page.component.html',
})
export class HomePageComponent {
  productsService = inject(ProductsService);
  paginationService = inject(PaginationService);

  get currentPage() {
    return this.paginationService.currentPage()
  }

  productsResource = rxResource({
    params: () => ({ page: this.currentPage - 1 }),
    stream: ({ request }: any) => {
      return this.productsService.getProducts({
        offset: request.page * 9
      });
    },
  });

}
