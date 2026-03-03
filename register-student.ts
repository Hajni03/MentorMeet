import { CommonModule } from '@angular/common';
import { Component, inject, signal, OnInit, OnDestroy } from '@angular/core';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { Subscription } from 'rxjs';
import { AuthService } from '../../shared/services/auth.service';
import { SchoolService } from '../../shared/services/school.service';
import { OsztalyService } from '../../shared/services/osztaly.service';

@Component({
  selector: 'app-register-student',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  templateUrl: './register-student.html',
  styleUrl: './register-student.scss',
})
export class RegisterStudent implements OnInit, OnDestroy {
  private schoolService = inject(SchoolService);
  private osztalyService = inject(OsztalyService);
  private authService = inject(AuthService);
  private fb = inject(FormBuilder);
  private router = inject(Router);

  iskolak = signal<any[]>([]);
  osztalyok = signal<any[]>([]);
  szakok = signal<any[]>([]);
  private schoolSub?: Subscription;

  form = this.fb.group({
    nev: ['', Validators.required],
    email: ['', [Validators.required, Validators.email]],
    jelszo: ['', [Validators.required, Validators.minLength(6)]],
    jelszoUjra: ['', Validators.required],
    iskola_id: ['', Validators.required],
    osztaly_id: [''],
    szak_id: [''],
    elfogadas: [false, Validators.requiredTrue],
  });

  ngOnInit() {
    this.schoolService.getIskolak().subscribe(data => this.iskolak.set(data));

    // Szakok betöltése már az elején, hogy rendelkezésre álljanak
    this.schoolService.getSzakok().subscribe(data => this.szakok.set(data));

    this.schoolSub = this.form.get('iskola_id')?.valueChanges.subscribe(val => {
      this.handleInstitutionChange(val);
    });
  }

  handleInstitutionChange(iskolaId: string | any) {
    const osztalyCtrl = this.form.get('osztaly_id');
    const szakCtrl = this.form.get('szak_id');

    // Alaphelyzet: minden validációt lekapcsolunk
    osztalyCtrl?.clearValidators();
    szakCtrl?.clearValidators();

    if (iskolaId === 'egyetem') {
      // ✅ Egyetemista: Csak szak kell, osztály NEM
      szakCtrl?.setValidators([Validators.required]);
      osztalyCtrl?.setValue(null);
    } else if (iskolaId && iskolaId !== '') {
      // ✅ Középiskolás: Osztály kell, szak NEM
      osztalyCtrl?.setValidators([Validators.required]);
      szakCtrl?.setValue(null);
      this.osztalyService.getOsztalyokByIskola(Number(iskolaId)).subscribe(data => this.osztalyok.set(data));
    }

    // ❗ Ez oldja fel a regisztráció gombot!
    osztalyCtrl?.updateValueAndValidity({ emitEvent: false, onlySelf: true });
    szakCtrl?.updateValueAndValidity({ emitEvent: false, onlySelf: true });
    this.form.updateValueAndValidity();
  }

  get passwordsMatch(): boolean {
    const p1 = this.form.get('jelszo')?.value;
    const p2 = this.form.get('jelszoUjra')?.value;
    return !!p1 && p1 === p2;
  }

  onSubmit() {
    if (this.form.invalid || !this.passwordsMatch) {
      this.form.markAllAsTouched();
      return;
    }

    const val = this.form.getRawValue(); // Így a null-okat is megkapjuk
    const isEgyetem = val.iskola_id === 'egyetem';

    const payload = {
      nev: val.nev,
      email: val.email,
      jelszo: val.jelszo,
      // Az adatbázis szerkezete alapján küldjük:
      iskola_id: isEgyetem ? null : Number(val.iskola_id),
      osztaly_id: isEgyetem ? null : Number(val.osztaly_id),
      szak_id: isEgyetem ? Number(val.szak_id) : null,
      szerep: 'student'
    };

    this.authService.registerStudent(payload).subscribe({
      next: () => {
        alert('Sikeres regisztráció!');
        this.router.navigate(['/login']);
      },
      error: (err) => alert('Hiba: ' + (err.error?.message || 'Szerver hiba'))
    });
  }

  ngOnDestroy() {
    if (this.schoolSub) this.schoolSub.unsubscribe();
  }
}