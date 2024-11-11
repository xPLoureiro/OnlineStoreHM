import { Component, OnInit, } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Produto } from '../../model/produto.type';
import { ProductService } from '../../services/product.service';
import { CommonModule, Location } from '@angular/common';
import { CustomcurrencyPipe } from '../../pipes/customcurrency.pipe';
import { AuthService } from '../../services/authentication.service';
import { CartService } from '../../services/cart.service';

@Component({
  selector: 'app-product-detail',
  standalone: true,
  imports: [CommonModule, CustomcurrencyPipe],
  templateUrl: './product-detail.component.html',
  styleUrl: './product-detail.component.css'
})

export class ProductDetailComponent implements OnInit {

  nonExistingIdError: boolean = false;
  produto!: Produto;

  constructor(
    private activeroute: ActivatedRoute,
    private productservice: ProductService,
    private authService: AuthService,
    private router: Router,
    private cartService: CartService,
    private location: Location
  ) { }

  ngOnInit() {
    const paramId = this.activeroute.snapshot.paramMap.get('id');
    if (paramId && Number(paramId)) {
      const id = Number(paramId);
      this.productservice.getProduto(id).subscribe({
        next: (produto) => this.produto = produto,
        error: (error) => {
          console.error('Erro ao buscar produto:', error);
          this.nonExistingIdError = true;
        }
      });
    } else {
      this.router.navigate(['error']);
    }
  }

  goToProductsPage() {
    this.router.navigate(['products']);
  }

  isUserLoggedIn(): boolean {
    return this.authService.isLoggedIn();
  }

  adicionarAoCarrinho(produto: Produto) {
    const message = this.cartService.addToCart(produto);
    alert(message);
  }

  voltar(): void {
    this.location.back();
  }
}