import { NgFor, NgIf } from '@angular/common';
import { Component,  signal, inject } from '@angular/core';
import { FormBuilder ,ReactiveFormsModule, Validators } from '@angular/forms';
import { SchoolService, Iskola } from '../../shared/services/school.service';
import { Router } from '@angular/router';


@Component({
  selector: 'app-school-select',
  standalone: true,
  imports: [ReactiveFormsModule, NgIf, NgFor],
  templateUrl: './school-select.html',
  styleUrl: './school-select.scss',
})
export class SchoolSelect {
   private readonly schoolService = inject(SchoolService);
  private readonly router = inject(Router);
  private readonly fb = inject(FormBuilder);

  iskolak = signal<Iskola[]>([]);
  isLoading = signal<boolean>(true);
  form = this.fb.group({
    iskola_id: [null, Validators.required],
  });

  ngOnInit() {
    this.schoolService.getIskolak().subscribe({
      next: (data) => {
        this.iskolak.set(data);
        this.isLoading.set(false);
      },
      error: (err) => {
        console.error('Hiba az iskolák lekérésekor:', err);
        this.isLoading.set(false);
      },
    });
  }

  onSubmit() {
    if (this.form.invalid) return;

    const iskolaId = this.form.value.iskola_id;
    const userId = Number(localStorage.getItem('userId')); // 🔐 vagy auth service-ből

    this.schoolService.updateUserSchool(userId, iskolaId!).subscribe({
      next: () => {
        this.router.navigate(['/dashboard']);
      },
      error: (err) => {
        console.error('Nem sikerült frissíteni az iskolát:', err);
      },
    });
  }
}
