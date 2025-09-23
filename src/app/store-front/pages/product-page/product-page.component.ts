import { ProductsService } from '@/produtcs/services/products.service';
import { Component, inject, input } from '@angular/core';
import { rxResource } from '@angular/core/rxjs-interop';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-product-page',
  imports: [],
  templateUrl: './product-page.component.html',
})
export class ProductPageComponent {

  activatedRoute = inject(ActivatedRoute);

  productIdSlug:string = this.activatedRoute.snapshot.params['idSlug']


  productsService = inject(ProductsService);

  productResource = rxResource({
    params: () => ({}),
    stream: ({ request }: any) => {
      return this.productsService.getProductByIdSlug(this.productIdSlug);
    },
  });
}
