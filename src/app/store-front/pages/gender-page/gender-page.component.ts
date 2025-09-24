import { Component, inject } from '@angular/core';
import { rxResource, toSignal } from '@angular/core/rxjs-interop';
import { ActivatedRoute } from '@angular/router';
import { map } from 'rxjs';
import { ProductsService } from '@/produtcs/services/products.service';
import { ProductCardComponent } from "@/produtcs/components/product-card/product-card.component";
import { PaginationComponent } from "@/shared/components/pagination/pagination.component";
import { PaginationService } from '@/shared/components/pagination/pagination.service';

@Component({
  selector: 'app-gender-page',
  imports: [ProductCardComponent, PaginationComponent],
  templateUrl: './gender-page.component.html',
})
export class GenderPageComponent {

  route = inject(ActivatedRoute);
  productsService = inject(ProductsService);
  paginationService = inject(PaginationService);

  get currentPage() {
    return this.paginationService.currentPage()
  }

  gender = toSignal(
    this.route.params.pipe(
      map(({ gender }) => gender)
    )
  );


  productsResource = rxResource({
    params: () => ({ gender: this.gender(), page: this.currentPage - 1 }),
    stream: ({ request }: any) => {
      return this.productsService.getProducts({
        gender: request.gender,
        offset: request.page * 9
      });
    },
  });
}
