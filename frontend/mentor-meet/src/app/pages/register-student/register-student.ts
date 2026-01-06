import { CommonModule } from '@angular/common';
import { Component, inject, signal } from '@angular/core';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../shared/services/auth.service';
import { SchoolService } from '../../shared/services/school.service';
import { OsztalyService } from '../../shared/services/osztaly.service';

@Component({
  selector: 'app-register-student',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './register-student.html',
  styleUrl: './register-student.scss',
})
export class RegisterStudent {
  private schoolService = inject(SchoolService);
  private osztalyService = inject(OsztalyService);
  private authService = inject(AuthService);
  private fb = inject(FormBuilder);
  private router = inject(Router);

  iskolak = signal<any[]>([]);
  osztalyok = signal<any[]>([]);

  form = this.fb.group({
    nev: ['', Validators.required],
    email: ['', [Validators.required, Validators.email]],
    jelszo: ['', [Validators.required, Validators.minLength(6)]],
    jelszoUjra: ['', Validators.required],

    iskola_id: ['', Validators.required],
    // ha nálatok kötelező osztályt választani, maradjon required:
    osztaly_id: ['', Validators.required],

    elfogadas: [false, Validators.requiredTrue],
  });

  ngOnInit() {
    console.log('RegisterStudent ngOnInit lefutott');

    // ✅ 1) Iskolák betöltése
    this.schoolService.getIskolak().subscribe({
      next: (iskolak) => this.iskolak.set(iskolak),
      error: (err) => {
        console.error('Hiba az iskolák lekérésekor:', err);
        alert('Nem sikerült betölteni az iskolákat.');
      },
    });

    // ✅ 2) Iskola változásra osztályok betöltése (EZ A LÉNYEG)
    this.form.get('iskola_id')?.valueChanges.subscribe((iskolaId) => {
      console.log('iskola_id változott:', iskolaId);

      if (!iskolaId) {
        this.osztalyok.set([]);
        // iskola törlésnél osztály mezőt is ürítjük
        this.form.patchValue({ osztaly_id: '' }, { emitEvent: false });
        return;
      }

      this.osztalyService.getOsztalyokByIskola(Number(iskolaId)).subscribe({
        next: (osztalyok) => {
          console.log('osztályok megjöttek:', osztalyok);
          this.osztalyok.set(osztalyok);

          // ha az eddigi osztaly_id már nem érvényes, ürítsük
          const current = this.form.get('osztaly_id')?.value;
          if (current && !osztalyok.some((o: any) => String(o.id) === String(current))) {
            this.form.patchValue({ osztaly_id: '' }, { emitEvent: false });
          }
        },
        error: (err) => {
          console.error('Hiba az osztályok lekérésekor:', err);
          this.osztalyok.set([]);
        },
      });
    });
  }

  get passwordsMatch() {
    return this.form.value.jelszo === this.form.value.jelszoUjra;
  }

  onSubmit() {
    if (!this.form.valid || !this.passwordsMatch) {
      this.form.markAllAsTouched();
      return;
    }

    // Payload: jelszoUjra NINCS.
    const payload: any = { ...this.form.value };
    delete payload.jelszoUjra;

    // Biztosítjuk, hogy szám legyen (ha backend ezt várja)
    payload.iskola_id = Number(payload.iskola_id);
    payload.osztaly_id = Number(payload.osztaly_id);

    // Később: this.authService.registerStudent(payload)
    this.authService.registerStudent(this.form.value).subscribe({
      next: (res) => {
        console.log('Sikeres diák regisztráció:', res);
        alert('Sikeres regisztráció!');
        this.router.navigate(['/login']);
      },
      error: (err) => {
        console.error('Hiba a regisztrációnál:', err);
        alert('Hiba: ' + (err?.error?.message || 'Ismeretlen hiba'));
      },
    });
  }
}
