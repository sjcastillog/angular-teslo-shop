import { ProductCardComponent } from '@/produtcs/components/product-card/product-card.component';
import { ProductsService } from '@/produtcs/services/products.service';
import { Component, inject } from '@angular/core';
import { rxResource } from '@angular/core/rxjs-interop';

@Component({
  selector: 'app-home-page',
  imports: [ProductCardComponent],
  templateUrl: './home-page.component.html',
})
export class HomePageComponent {
  productsService = inject(ProductsService);

  productsResource = rxResource({
    params: () => ({}),
    stream: ({ request }: any) => {
      return this.productsService.getProducts({});
    },
  });

}
