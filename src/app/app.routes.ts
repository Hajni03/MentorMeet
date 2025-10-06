import { Routes } from '@angular/router';
import { Landing } from './pages/landing/landing';
import { Register } from './pages/register/register';

export const routes: Routes = [
    {path: '', component: Landing}, //kezdőoldal
    {path: 'register', component: Register}, //regisztrációs oldal útvonal
    {path: '**', redirectTo: ''}, //404 -> kezdőoldal
    
];
