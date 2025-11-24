import { Component } from '@angular/core';
import { RegisterService } from '../../services/register';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';


@Component({
  selector: 'app-register',
  standalone: true,
  imports: [FormsModule, CommonModule, HttpClientModule],
  templateUrl: './register.html',
  styleUrls: ['./register.scss']
})
export class Register {

 formData = {
    nev: '',
    email: '',
    jelszo: '',
    szerep: 'diak',
    iskola_id: null,
    osztaly_id: null
  };

   constructor(private registerService: RegisterService) {}

  onSubmit() {
    this.registerService.register(this.formData).subscribe({
      next: res => {
        alert('Sikeres regisztráció!');
        console.log(res);
      },
      error: err => {
        console.error('Hiba:', err);
        alert('Hiba a regisztráció során.');
      }
    });
  }
}
