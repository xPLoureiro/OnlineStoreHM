import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, map, Observable, switchMap, of, forkJoin } from 'rxjs';
import { Wishlist } from '../model/wishlist.type';
import { ProductService } from './product.service';

@Injectable({
  providedIn: 'root'
})
export class WishlistService {
  private urlAPI = 'http://localhost:3000/wishlists';

  constructor(private http: HttpClient, private productService: ProductService) { }

  getWishlistProdutos(userId: number): Observable<any[]> {
    return this.http.get<Wishlist[]>(`${this.urlAPI}?userId=${userId}`).pipe(
      switchMap(wishlists => {
        if (wishlists.length > 0) {
          const productIds = wishlists[0].productIds;
          const productObservables = productIds.map(id => this.productService.getProduto(id));
          return forkJoin(productObservables);
        } else {
          return [];
        }
      })
    );
  }

  getWishlist(userId: number): Observable<number[]> {
    return this.http.get<any[]>(`${this.urlAPI}?userId=${userId}`).pipe(
      map(wishlists => {
        const wishlist = wishlists[0];
        return wishlist ? wishlist.productIds : [];
      })
    );
  }

  addToWishlist(userId: number, productId: number): Observable<any> {
    return this.http.get<Wishlist[]>(`${this.urlAPI}?userId=${userId}`).pipe(
      switchMap((wishlists: Wishlist[]) => {
        if (wishlists.length > 0) {
          const wishlist = wishlists[0];

          if (!Array.isArray(wishlist.productIds)) {
            wishlist.productIds = [];
          }

          if (!(wishlist.productIds as number[]).includes(productId)) {
            (wishlist.productIds as number[]).push(productId);
            return this.http.patch(`${this.urlAPI}/${wishlist.id as number}`, { productIds: wishlist.productIds });
          } else {
            console.log('Produto já está na wishlist.');
            return of(null);
          }
        } else {
          const newWishlist: Wishlist = { id: 0, userId, productIds: [productId] };
          return this.http.post(this.urlAPI, newWishlist);
        }
      }),
      catchError(error => {
        console.error('Erro ao adicionar à wishlist:', error);
        return of(null);
      })
    );
  }

  removeFromWishlist(userId: number, productId: number): Observable<any> {
    return this.http.get<Wishlist[]>(`${this.urlAPI}?userId=${userId}`).pipe(
      switchMap(wishlists => {
        if (wishlists.length > 0) {
          const wishlist = wishlists[0];
          const index = wishlist.productIds.indexOf(productId);
          if (index > -1) {
            wishlist.productIds.splice(index, 1);
            return this.http.patch(`${this.urlAPI}/${wishlist.id}`, { productIds: wishlist.productIds });
          }
        }
        return [];
      })
    );
  }
}