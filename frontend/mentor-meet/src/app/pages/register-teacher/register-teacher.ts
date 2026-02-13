import { Component, OnInit, signal } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../shared/services/auth.service';
import { SchoolService } from '../../shared/services/school.service';
import { OsztalyService } from '../../shared/services/osztaly.service';


@Component({
  selector: 'app-register-teacher',
  imports: [
    ReactiveFormsModule, // 2. Add hozzá az importhoz!
    CommonModule         // Ezt is, hogy működjön az iskolák listázása
  ],
  templateUrl: './register-teacher.html',
  styleUrls: ['./register-teacher.scss']
})
export class RegisterTeacher implements OnInit {
  form: FormGroup;
  
  // Signalok használata az iskolák és osztályok tárolására (Angular 17+ stílus)
  iskolak = signal<any[]>([]);
  osztalyok = signal<any[]>([]);

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private schoolService: SchoolService,
    private osztalyService: OsztalyService,
    private router: Router
  ) {
    // Form inicializálása
    this.form = this.fb.group({
      nev: ['', [Validators.required, Validators.minLength(3)]],
      email: ['', [Validators.required, Validators.email]],
      jelszo: ['', [Validators.required, Validators.minLength(6)]],
      jelszoUjra: ['', [Validators.required]],
      iskola_id: [null, [Validators.required]],
      osztaly_id: [null], // Tanárnál nem kötelező!
      elfogadas: [false, [Validators.requiredTrue]]
    }, { validators: this.passwordMatchValidator });
  }

  ngOnInit(): void {
    // Iskolák betöltése indításkor
    this.schoolService.getIskolak().subscribe({
      next: (data) => this.iskolak.set(data),
      error: (err) => console.error('Hiba az iskolák betöltésekor:', err)
    });

    // Ha változik az iskola, töltsük be az osztályokat (opcionális infó a tanárnak)
    this.form.get('iskola_id')?.valueChanges.subscribe(iskolaId => {
      if (iskolaId) {
        this.osztalyService.getOsztalyokByIskola(iskolaId).subscribe({
          next: (data) => this.osztalyok.set(data),
          error: (err) => console.error('Hiba az osztályok betöltésekor:', err)
        });
      }
    });
  }

  // Jelszó egyezés ellenőrző
  passwordMatchValidator(g: FormGroup) {
    return g.get('jelszo')?.value === g.get('jelszoUjra')?.value
      ? null : { 'mismatch': true };
  }

  onSubmit() {
    if (this.form.valid) {
      // Csak azokat az adatokat küldjük, amik kellenek
      const payload = {
        nev: this.form.value.nev,
        email: this.form.value.email,
        jelszo: this.form.value.jelszo,
        iskola_id: this.form.value.iskola_id,
        osztaly_id: this.form.value.osztaly_id
      };

      console.log('Tanár regisztráció küldése...', payload);

      this.authService.registerTeacher(payload).subscribe({
        next: (res) => {
          alert('Sikeres tanár regisztráció!');
          this.router.navigate(['/login']);
        },
        error: (err) => {
          console.error('Szerver hiba:', err);
          alert(err.error?.message || 'Hiba történt a regisztráció során.');
        }
      });
    }
  }
}