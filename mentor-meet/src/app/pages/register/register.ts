import { CommonModule } from '@angular/common';
import { Component, computed, effect, inject, signal } from '@angular/core';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';


@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './register.html',
  styleUrl: './register.scss',
})
export class Register {
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

  get passwordsMatch() {
    return this.form.value.jelszo === this.form.value.jelszoUjra;
  }

  onSubmit() {
    if (!this.form.valid || !this.passwordsMatch) {
      this.form.markAllAsTouched();
      return;
    }

    const payload = { ...this.form.value };
    delete payload.jelszoUjra;

    // TODO: Küldés a backendre
    console.log('Regisztrációs adatok:', payload);

    // Navigálás vagy visszajelzés
    this.router.navigate(['/login']);
  }

  // DEMÓ: itt lehetne API hívás az iskolák/osztályok lekérésére
  ngOnInit() {
    this.iskolak.set([
      { id: 1, nev: 'Budai Gimnázium' },
      { id: 2, nev: 'Szegedi Általános' }
    ]);

    this.osztalyok.set([
      { id: 1, nev: '10.A', iskola_id: 1 },
      { id: 2, nev: '11.B', iskola_id: 2 }
    ]);
  }
}
