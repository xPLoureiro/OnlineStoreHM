import { Injectable } from '@angular/core';
import { Produto } from '../model/produto.type';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { catchError, map, Observable, tap, throwError } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ProductService {
  private urlAPI = 'http://localhost:3000/produtos';

  constructor(private http: HttpClient) { }

  private errorHandler(error: HttpErrorResponse) {
    if (error.status === 404) {
      return throwError(() => error.message)
    } else {
      return throwError(() => "Ocorreu um erro!")
    }
  }

  getAll(): Observable<Produto[]> {
    return this.http.get<Produto[]>(this.urlAPI)
      .pipe(
        catchError(this.errorHandler)
      );
  }

  getProduto(id: number): Observable<Produto> {
    return this.http.get<Produto>(`${this.urlAPI}/${id}`).pipe(
      tap(produto => console.log(produto)), catchError(this.errorHandler)
    );
  }

  getProdutos(page: number, limit: number): Observable<any> {
    return this.http.get<any>(this.urlAPI).pipe(map((data) => {
      const produtos = data.produtos.slice((page - 1) * limit, page * limit);
      return {
        produtos: produtos,
        total: data.produtos.length
      };
    })
    );
  }
}