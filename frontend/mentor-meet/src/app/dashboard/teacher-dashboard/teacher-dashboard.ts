import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DashboardLayoutComponent } from '../dashboard-layout/dashboard-layout';
import { AuthService } from '../../shared/services/auth.service';

@Component({
  selector: 'app-teacher-dashboard',
  standalone: true,
  imports: [CommonModule, DashboardLayoutComponent],
  templateUrl: './teacher-dashboard.html',
  styleUrl: './teacher-dashboard.scss'
})
export class TeacherDashboard implements OnInit {
  private authService = inject(AuthService);

  // Változók deklarálása a HTML hibák elkerülése végett
  user: any = null;
  requests: any[] = [];

  ngOnInit() {
    // Adatok betöltése a bejelentkezéskor elmentett adatokból
    const savedUser = localStorage.getItem('user');
    if (savedUser) {
      this.user = JSON.parse(savedUser);
    }
  }

  onLogout() {
    this.authService.logout(); // Meghívja a közös kijelentkezés logikát
  }
}