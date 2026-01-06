import { Component, inject } from '@angular/core'; // inject hozzáadva a modernebb kódért
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
  // 1. A formot inicializáljuk a konstruktor előtt vagy inject-tel
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
          // Ellenőrizzük, hogy jött-e user adat
          if (res && res.user) {
            console.log('Sikeres belépés:', res.user);
            
            // Adatok mentése a böngészőbe
            localStorage.setItem('user', JSON.stringify(res.user));

            // Szerepkör alapú irányítás
            if (res.user.szerep === 'tanar') {
              this.router.navigate(['/teacher-dashboard']);
            } else {
              this.router.navigate(['/student-dashboard']);
            }
          }
        },
        error: (err: any) => {
          // Részletesebb hibaüzenet kezelés
          console.error('Login hiba:', err);
          alert(err.error?.message || 'Hibás belépési adatok vagy szerverhiba!');
        }
      });
    }
  }
}