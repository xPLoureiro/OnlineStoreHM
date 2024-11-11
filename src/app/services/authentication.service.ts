import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, catchError, map, Observable, throwError } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private urlAPI = 'http://localhost:3000/utilizadores';
  private isAuthenticatedSubject: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(this.isLoggedIn());
  public isAuthenticated$: Observable<boolean> = this.isAuthenticatedSubject.asObservable();

  constructor(private http: HttpClient) { }

  private errorHandler(error: HttpErrorResponse) {
    if (error.status === 404) {
      return throwError(() => new Error('Utilizador não encontrado!'));
    } else {
      return throwError(() => new Error('Ocorreu um erro ao válidar as credenciais.'));
    }
  }

  login(email: string, password: string): Observable<boolean> {
    return this.http.get<any[]>(this.urlAPI).pipe(
      catchError(this.errorHandler),
      map(users => {
        const user = users.find(u => u.email === email && u.senha === password);
        if (user) {
          sessionStorage.setItem('isAuthenticated', 'true');
          sessionStorage.setItem('userName', user.nome);
          sessionStorage.setItem('userId', user.id.toString());
          this.isAuthenticatedSubject.next(true);
          return true;
        } else {
          return false;
        }
      })
    );
  }

  isLoggedIn(): boolean {
    return sessionStorage.getItem('isAuthenticated') === 'true';
  }

  getUserName(): string {
    return sessionStorage.getItem('userName') || '';
  }

  getLoggedUserId(): number | null {
    return Number(sessionStorage.getItem('userId'));
  }

  logout(): void {
    sessionStorage.removeItem('isAuthenticated');
    sessionStorage.removeItem('userName');
    this.isAuthenticatedSubject.next(false);
  }
}