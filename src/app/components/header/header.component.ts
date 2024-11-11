import { Component, OnDestroy, OnInit } from '@angular/core';
import { AuthService } from '../../services/authentication.service';
import { CommonModule } from '@angular/common';
import { MatMenuModule } from '@angular/material/menu';
import { Router, RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { LogoutmodalComponent } from "../logoutmodal/logoutmodal.component";
import { Subscription } from 'rxjs';
import { LoginmodalComponent } from '../loginmodal/loginmodal.component';


@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule, MatMenuModule, RouterModule, FormsModule, LoginmodalComponent, LogoutmodalComponent],
  templateUrl: './header.component.html',
  styleUrl: './header.component.css'
})

export class HeaderComponent implements OnInit, OnDestroy {
  isAuthenticated: boolean = false;
  userName: string | null = null;
  showLoginModal: boolean = false;
  isLogoutModalVisible = false;
  isMenuOpen = false;

  private authSubscription: Subscription | undefined;

  constructor(private authService: AuthService, private router: Router) { }

  ngOnInit(): void {
    this.authSubscription = this.authService.isAuthenticated$.subscribe((isAuthenticated) => {
      this.isAuthenticated = isAuthenticated;
      if (isAuthenticated) {
        this.userName = this.authService.getUserName();
      } else {
        this.userName = '';
      }
    });
  }

  ngOnDestroy() {
    // para evitar memory leaks
    if (this.authSubscription) {
      this.authSubscription.unsubscribe();
    }
  }

  onLogout() {
    this.authService.logout();
    this.isAuthenticated = false;
    this.userName = null;
  }

  openLoginModal() {
    this.showLoginModal = true;
  }

  closeLoginModal() {
    this.showLoginModal = false;
  }

  openLogoutModal() {
    this.isLogoutModalVisible = true;
  }

  closeLogoutModal() {
    this.isLogoutModalVisible = false;
  }

  logout() {
    this.authService.logout();
    this.isLogoutModalVisible = false;
    this.isAuthenticated = false;
  }

  toggleMenu() {
    this.isMenuOpen = !this.isMenuOpen;
  }
}