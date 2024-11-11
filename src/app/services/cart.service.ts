import { Injectable } from '@angular/core';
import { Produto } from '../model/produto.type';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CartService {
  private cartItems: Produto[] = [];
  private cartItemsSubject = new BehaviorSubject<Produto[]>([]);

  constructor() {
    const storedCart = localStorage.getItem('cartItems');
    if (storedCart) {
      this.cartItems = JSON.parse(storedCart);
      this.cartItemsSubject.next(this.cartItems);
    }
  }

  getCartItems(): Observable<Produto[]> {
    return this.cartItemsSubject.asObservable();
  }

  addToCart(produto: Produto): string {
    if (this.cartItems.some(item => item.id === produto.id)) {
      return 'Produto já está no carrinho';
    } else {
      this.cartItems.push(produto);
      this.updateCart();
      return 'Produto adicionado ao carrinho';
    }
  }

  removeFromCart(produtoId: number): void {
    this.cartItems = this.cartItems.filter(item => item.id !== produtoId);
    this.updateCart();
  }

  private updateCart(): void {
    this.cartItemsSubject.next(this.cartItems);
    localStorage.setItem('cartItems', JSON.stringify(this.cartItems));
  }

  getTotal(): number {
    return this.cartItems.reduce((total, item) => total + item.preco, 0);
  }
}