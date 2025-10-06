import { Routes } from '@angular/router';
import { Landing } from './pages/landing/landing';
import { Register } from './pages/register/register';

export const routes: Routes = [
    {path: '', component: Landing}, //kezdőoldal
    {path: '**', redirectTo: ''}, //404 -> kezdőoldal
    {path: 'register', component: Register}
];
