import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router'; // Kell a routerLink-hez!
import { DashboardLayoutComponent } from '../dashboard-layout/dashboard-layout';
import { AuthService } from '../../shared/services/auth.service';

@Component({
  selector: 'app-student-dashboard',
  standalone: true,
  imports: [CommonModule, RouterModule, DashboardLayoutComponent],
  templateUrl: './student-dashboard.html',
  styleUrl: './student-dashboard.scss'
})
export class StudentDashboard implements OnInit {
  private authService = inject(AuthService);
  
  // 1. Deklaráld a user változót, különben hiba lesz a HTML-ben!
  user: any = null;

  ngOnInit() {
    // 2. Töltsd be az adatokat a localStorage-ból
    const savedUser = localStorage.getItem('user');
    if (savedUser) {
      this.user = JSON.parse(savedUser);
    }
  }

  onLogout() {
    this.authService.logout(); //
  }
}