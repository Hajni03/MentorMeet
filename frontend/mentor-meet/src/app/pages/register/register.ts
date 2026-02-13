import { CommonModule } from '@angular/common';
import { Component, computed, effect, inject, signal } from '@angular/core';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../shared/services/auth.service';
import { SchoolService } from '../../shared/services/school.service';
import { OsztalyService } from '../../shared/services/osztaly.service';


@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './register.html',
  styleUrl: './register.scss',
})
export class Register {
  private schoolService = inject(SchoolService);
  private osztalyService = inject(OsztalyService);

  private authService = inject(AuthService);
  private fb = inject(FormBuilder);
  private router = inject(Router);

  iskolak = signal<any[]>([]);
  osztalyok = signal<any[]>([]);
  szerepek = ['diak', 'tanar'];

  form = this.fb.group({
    nev: ['', Validators.required],
    email: ['', [Validators.required, Validators.email]],
    jelszo: ['', [Validators.required, Validators.minLength(6)]],
    jelszoUjra: ['', [Validators.required]],
    szerep: ['', Validators.required],
    iskola_id: ['', Validators.required],
    osztaly_id: [''],
    elfogadas: [false, Validators.requiredTrue],
  });
  
  // Figyeli, ha az iskola_id változik, és betölti a hozzá tartozó osztályokat
  osztalyEffect = effect(() => {
  const iskolaId = Number(this.form.get('iskola_id')?.value);
  if (!iskolaId) {
    this.osztalyok.set([]);
    return;
  }

  this.osztalyService.getOsztalyokByIskola(iskolaId).subscribe({
    next: (osztalyok) => this.osztalyok.set(osztalyok),
    error: (err) => {
      console.error('Hiba az osztályok lekérésekor:', err);
      this.osztalyok.set([]);
    }
  });
});


  get passwordsMatch() {
    return this.form.value.jelszo === this.form.value.jelszoUjra;
  }

  onSubmit() {
    if (!this.form.valid || !this.passwordsMatch) {
      this.form.markAllAsTouched();
      return;
    }

    const data = {
      nev: this.form.value.nev,
      email: this.form.value.email,
      jelszo: this.form.value.jelszo,
      szerep: this.form.value.szerep,
      iskola_id: Number(this.form.value.iskola_id),
      osztaly_id: Number(this.form.value.osztaly_id)
    };

    const payload = { ...this.form.value };
    delete payload.jelszoUjra;

    this.authService.registerStudent(payload).subscribe({
      next: (res) => {
        console.log('Sikeres regisztráció:', res);
        alert('Sikeres regisztráció!');
        this.router.navigate(['/login']);
      },
      error: (err) => {
        console.error('Hiba a regisztrációnál:', err);
        alert('Hiba: ' + (err?.error?.message || 'Ismeretlen hiba'));
      }
    });
  }
ngOnInit() {
  // 🔽 1. Iskolák betöltése
  this.schoolService.getIskolak().subscribe({
    next: (iskolak) => this.iskolak.set(iskolak),
    error: (err) => {
      console.error('Hiba az iskolák lekérésekor:', err);
      alert('Nem sikerült betölteni az iskolákat.');
    }
  });

  // 🔁 2. Osztályok betöltése, amikor iskolát választanak
  this.form.get('iskola_id')?.valueChanges.subscribe((iskolaId) => {
    if (!iskolaId) {
      this.osztalyok.set([]);
      return;
    }

    this.osztalyService.getOsztalyokByIskola(Number(iskolaId)).subscribe({
      next: (osztalyok) => this.osztalyok.set(osztalyok),
      error: (err) => {
        console.error('Hiba az osztályok lekérésekor:', err);
        alert('Nem sikerült betölteni az osztályokat.');
        this.osztalyok.set([]);
      }
    });
  });
}
}
