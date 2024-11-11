import { Component, EventEmitter, Output } from '@angular/core';

@Component({
  selector: 'app-logoutmodal',
  standalone: true,
  imports: [],
  templateUrl: './logoutmodal.component.html',
  styleUrl: './logoutmodal.component.css'
})
export class LogoutmodalComponent {
  @Output() closeModalEvent = new EventEmitter<void>();
  @Output() confirmLogoutEvent = new EventEmitter<void>();

  closeModal() {
    this.closeModalEvent.emit();
  }

  confirmLogout() {
    this.confirmLogoutEvent.emit();
  }
}
