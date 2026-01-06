import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthService } from '../shared/services/auth.service';
import { DashboardLayoutComponent } from '../dashboard/dashboard-layout/dashboard-layout';

@Component({
  selector: 'app-user-list',
  standalone: true,
  imports: [CommonModule, DashboardLayoutComponent],
  templateUrl: './user-list.html',
  styleUrl: './user-list.scss'
})
export class UserListComponent implements OnInit {
  private authService = inject(AuthService);
  users: any[] = [];
  currentUser: any;

  ngOnInit() {
    this.currentUser = JSON.parse(localStorage.getItem('user') || '{}');
    this.loadUsers();
  }

  loadUsers() {
    this.authService.getUsers(this.currentUser.id, this.currentUser.szerep).subscribe(res => {
      this.users = res;
    });
  }

  onSearch(event: any) {
    const searchTerm = event.target.value;
    // Meghívjuk a szervizt az új kulcsszóval
    this.authService.getUsers(this.currentUser.id, this.currentUser.szerep, searchTerm).subscribe(res => {
      this.users = res;
    });
  }

  onAddContact(targetId: number) {
    // Diák jelöl tanárt, vagy Tanár jelöl diákot
    const diakId = this.currentUser.szerep === 'diak' ? this.currentUser.id : targetId;
    const tanarId = this.currentUser.szerep === 'tanar' ? this.currentUser.id : targetId;

    this.authService.addContact(diakId, tanarId).subscribe({
      next: (res) => alert(res.message),
      error: (err) => alert(err.error?.message || 'Hiba történt')
    });
  }
}