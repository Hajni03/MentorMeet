import { Routes } from '@angular/router';
import { Landing } from './pages/landing/landing';

export const routes: Routes = [
    {path: '', component: Landing}, //kezdőoldal
    { path: '**', redirectTo: ''} //404 -> kezdőoldal
];
