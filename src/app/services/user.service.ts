import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { catchError, map, Observable, switchMap, throwError } from 'rxjs';
import { Utilizador } from '../model/utilizador.type';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private apiUrl = 'http://localhost:3000/utilizadores';

  constructor(private http: HttpClient) { }

  private isValidPassword(password: string): boolean {
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*]).{8,}$/;
    return passwordRegex.test(password);
  }

  register(user: Omit<Utilizador, 'id' | 'status'>): Observable<any> {
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    return this.http.get<Utilizador[]>(this.apiUrl).pipe(
      map(users => {
        const emailExists = users.some(existingUser => existingUser.email === user.email);

        if (emailExists) {
          throw new Error('O e-mail já está em uso');
        }

        if (!emailRegex.test(user.email)) {
          throw new Error('O e-mail fornecido não está em um formato válido');
        }

        if (!this.isValidPassword(user.senha)) {
          throw new Error('A senha deve ter no mínimo 8 caracteres, incluindo uma maiúscula, uma minúscula, um número e um símbolo');
        }

        const newUser: Utilizador = {
          ...user,
          id: Date.now(),
          status: false
        };
        return newUser;
      }),
      switchMap(validUser => this.http.post<Utilizador>(this.apiUrl, validUser)),
      catchError((error) => {
        const errorMessage = error.error?.message || error.message || 'Erro desconhecido';
        return throwError(() => new Error(errorMessage));
      })
    );
  }

  private handleError(error: HttpErrorResponse): Observable<never> {
    let errorMsg: string;
    if (error.error instanceof ErrorEvent) {
      errorMsg = `Ocorreu um erro: ${error.error.message}`;
    } else {
      errorMsg = `Erro do servidor: ${error.status}, ` + `mensagem: ${error.message}`;
    }
    return throwError(() => new Error(errorMsg));
  }

  getUtilizadores(): Observable<Utilizador[]> {
    return this.http.get<Utilizador[]>(this.apiUrl);
  }

  getUtilizador(id: number): Observable<Utilizador> {
    return this.http.get<Utilizador>(`${this.apiUrl}/${id}`);
  }

  getUserById(id: number): Observable<any> {
    return this.http.get(`${this.apiUrl}/${id}`).pipe(catchError(this.handleError));
  }

  updateUser(user: any): Observable<any> {
    return this.http.put(`${this.apiUrl}/${user.id}`, user).pipe(catchError(this.handleError));
  }

  changePassword(userId: number, passwords: { oldPassword: string, newPassword: string }): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/${userId}`).pipe(
      switchMap(user => {
        if (user.senha !== passwords.oldPassword) {
          throw new Error('A senha antiga não está correta');
        }

        const updatedUser = { ...user, senha: passwords.newPassword };
        return this.http.put(`${this.apiUrl}/${userId}`, updatedUser);
      })
    );
  }
}