import { Component, OnInit } from '@angular/core';
import { CustomcurrencyPipe } from '../../pipes/customcurrency.pipe';
import { CommonModule, Location } from '@angular/common';
import { Router } from '@angular/router';
import { CartService } from '../../services/cart.service';
import { Produto } from '../../model/produto.type';

@Component({
  selector: 'app-cart',
  standalone: true,
  imports: [CommonModule, CustomcurrencyPipe],
  templateUrl: './cart.component.html',
  styleUrl: './cart.component.css'
})
export class CartComponent implements OnInit {
  cartItems: Produto[] = [];

  constructor(private cartService: CartService, private router: Router, private location: Location) { }

  ngOnInit(): void {
    this.cartService.getCartItems().subscribe(items => this.cartItems = items);
  }

  removerDoCarrinho(produtoId: number) {
    this.cartService.removeFromCart(produtoId);
  }

  getTotal(): number {
    return this.cartService.getTotal();
  }

  viewProduct(productId: number) {
    this.router.navigate(['/products', productId]);
  }

  voltar(): void {
    this.location.back();
  }
}