import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../../shared/services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  templateUrl: './login.html',
  styleUrls: ['./login.scss']
})
export class Login {
  private fb = inject(FormBuilder);
  private authService = inject(AuthService);
  private router = inject(Router);

  loginForm: FormGroup = this.fb.group({
    email: ['', [Validators.required, Validators.email]],
    jelszo: ['', [Validators.required]],
    rememberMe: [false]
  });

  onSubmit() {
    if (this.loginForm.valid) {
      this.authService.login(this.loginForm.value).subscribe({
        next: (res: any) => {
          if (res && res.user) {
            console.log('Sikeres belépés:', res.user);
            
            // Adatok mentése a böngészőbe
            localStorage.setItem('user', JSON.stringify(res.user));

            // SZEREPKÖR ALAPÚ IRÁNYÍTÁS MÓDOSÍTÁSA
            if (res.user.szerep === 'tanar') {
              // A naptár helyett mostantól a profil szerkesztőbe küldjük, 
              // hogy kényszerítsük a tantárgyválasztást
              this.router.navigate(['/teacher-profile-edit']);
            } else if (res.user.szerep === 'diak') {
              this.router.navigate(['/student-dashboard']);
            } else {
              // Biztonsági tartalék, ha lenne más szerepkör
              this.router.navigate(['/']);
            }
          }
        },
        error: (err: any) => {
          console.error('Login hiba:', err);
          alert(err.error?.message || 'Hibás belépési adatok vagy szerverhiba!');
        }
      });
    }
  }
}