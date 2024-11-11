import { Component } from '@angular/core';
import { UserService } from '../../services/user.service';
import { CommonModule, Location } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './register.component.html',
  styleUrl: './register.component.css'
})
export class RegisterComponent {
  user = { nome: '', email: '', senha: '', morada: '', cod_postal: '', pais: '' };
  errorMessage = '';

  constructor(private userService: UserService, private router: Router, private location: Location) { }

  onRegister() {
    const user = {
      nome: this.user.nome,
      email: this.user.email,
      senha: this.user.senha,
      morada: this.user.morada,
      cod_postal: this.user.cod_postal,
      pais: this.user.pais
    };

    this.userService.register(user).subscribe({
      next: () => {
        alert('Registo efetuado com sucesso! Por favor aguarde pela ativação do seu registo para poder efetuar login.');
        this.router.navigate(['/']);
      },
      error: (error) => {
        console.error('Erro ao registar utilizador:', error);
        const errorMessage = error.message || 'Ocorreu um erro inesperado no registo. Por favor, tente novamente.';
        alert(errorMessage);
      }
    });
  }

  onSubmit() {
    this.userService.register(this.user).subscribe({
      next: () => {
        alert('Registo concluído com sucesso!');
      },
      error: (err) => {
        this.errorMessage = err.message;
      }
    });
  }

  voltar(): void {
    this.location.back();
  }
}
