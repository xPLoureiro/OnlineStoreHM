import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { UserService } from '../../services/user.service';
import { Router } from '@angular/router';
import { CommonModule, Location } from '@angular/common';
import { AuthService } from '../../services/authentication.service';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.css'
})
export class ProfileComponent implements OnInit {

  user: any = {};
  isEditing = false;
  passwords = { oldPassword: '', newPassword: '', confirmPassword: '' };

  constructor(private userService: UserService, private authService: AuthService, private router: Router, private location: Location) { }

  ngOnInit() {
    this.loadUserData();
  }

  loadUserData() {
    const userId = this.authService.getLoggedUserId();

    if (!userId) {
      alert('Utilizador não autenticado. Redirecionando para a página de login.');
      this.router.navigate(['/login']);
      return;
    }

    this.userService.getUserById(userId).subscribe(
      data => this.user = data,
      error => console.error('Erro ao carregar dados do usuário:', error)
    );
  }

  enableEditing() {
    this.isEditing = true;
  }

  cancelEditing() {
    this.isEditing = false;
    this.loadUserData();
  }

  onSubmit() {
    this.userService.updateUser(this.user).subscribe({
      next: () => {
        alert('Informação atualizada com sucesso!');
        this.isEditing = false;
      },
      error: error => alert('Erro ao atualizar informação: ' + error.message)
    });
  }

  onChangePassword() {
    if (this.passwords.newPassword !== this.passwords.confirmPassword) {
      alert('As novas senhas não coincidem.');
      return;
    }

    this.userService.changePassword(this.user.id, this.passwords).subscribe({
      next: () => alert('Senha alterada com sucesso!'),
      error: error => alert('Erro ao alterar senha: ' + error.message)
    });
  }

  voltar(): void {
    this.location.back();
  }
}
