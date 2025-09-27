import { Component, effect, inject } from '@angular/core';
import { rxResource, toSignal } from '@angular/core/rxjs-interop';
import { ActivatedRoute, Router } from '@angular/router';
import { map } from 'rxjs';
import { ProductDetailsComponent } from "./product-details/product-details.component";
import { ProductsService } from '@/produtcs/services/products.service';

@Component({
  selector: 'app-product-admin-page',
  imports: [ProductDetailsComponent],
  templateUrl: './product-admin-page.component.html',
})
export class ProductAdminPageComponent {
  activatedRoute = inject(ActivatedRoute);

  router = inject(Router);

  productsService = inject(ProductsService);

  productId = toSignal(this.activatedRoute.params.pipe(map((params) => params['id'])));

  productsResource = rxResource({
    params: () => ({ id: this.productId() }),
    stream: ({ request }: any) => {
      return this.productsService.getProductById(request.id);
    },
  });

  redirectEffect = effect(()=>{
    if(this.productsResource.error()){
      this.router.navigate(['/admin/products'])
    }
  })


}
