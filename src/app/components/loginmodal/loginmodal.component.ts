import { Component, Output, EventEmitter } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../services/authentication.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-login-modal',
  templateUrl: './loginmodal.component.html',
  styleUrls: ['./loginmodal.component.css'],
  standalone: true,
  imports: [CommonModule, FormsModule]
})
export class LoginmodalComponent {
  email: string = '';
  password: string = '';
  loginError: string | null = null;

  @Output() closeModal = new EventEmitter<void>();

  constructor(private authService: AuthService) { }

  onLogin(): void {
    this.authService.login(this.email, this.password).subscribe({
      next: (authenticated) => {
        if (authenticated) {
          this.closeModal.emit();
          this.loginError = null;
        } else {
          this.loginError = 'Utilizador inexistente!';
        }
      },
      error: (err) => {
        this.loginError = 'Erro ao tentar fazer o login. Tente novamente.';
      }
    });
  }

  close() {
    this.closeModal.emit();
  }
}