import { Routes } from '@angular/router';
import { LandingPage } from './landing/landing-page/landing-page';
import { Login } from './pages/login/login';
import { Register } from './pages/register/register';
import { Contact } from './pages/contact/contact';
import { Faq } from './pages/faq/faq';
import { Blog } from './pages/blog/blog';
import { Dashboard } from './dashboard/dashboard/dashboard';
import { SchoolSelect } from './pages/school-select/school-select';

export const routes: Routes = [
    { path: '', component: LandingPage},
    { path: 'login', component: Login},
    { path: 'register', component: Register},
    { path: 'kapcsolat', component: Contact},
    { path: 'gyik', component: Faq},
    { path: 'blog', component: Blog},
    { path:'dashboard', component: Dashboard},
    { path: 'iskola-valasztas', loadComponent: () => import('./pages/school-select/school-select').then(m => m.SchoolSelect), },
    {path: '**', redirectTo: ''}
];
