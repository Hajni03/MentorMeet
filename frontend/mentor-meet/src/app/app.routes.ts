import { Routes } from '@angular/router';
import { LandingPage } from './landing/landing-page/landing-page';
import { Login } from './pages/login/login';
import { Register } from './pages/register/register';
import { Contact } from './pages/contact/contact';
import { Faq } from './pages/faq/faq';
import { Blog } from './pages/blog/blog';
import { StudentDashboard } from './dashboard/student-dashboard/student-dashboard';
import { TeacherDashboard } from './dashboard/teacher-dashboard/teacher-dashboard';
import { SchoolSelect } from './pages/school-select/school-select';
import { RegisterChoice } from './pages/register-choice/register-choice';
import { RegisterStudent } from './pages/register-student/register-student';
import { RegisterTeacher } from './pages/register-teacher/register-teacher';
import { authGuard } from './shared/guards/auth-guard';
import { UserListComponent } from './user-list/user-list';

export const routes: Routes = [
    { path: '', component: LandingPage },
    { path: 'login', component: Login },
    {
        path: 'student-dashboard',
        component: StudentDashboard,
        canActivate: [authGuard] // ✅ Csak belépve érhető el
    },
    {
        path: 'teacher-dashboard',
        component: TeacherDashboard,
        canActivate: [authGuard] // ✅ Csak belépve érhető el
    },
    { path: 'user-list', component: UserListComponent },
    { path: 'register', component: RegisterChoice },      //választó oldal
    { path: 'register/student', component: RegisterStudent },    //Diák
    { path: 'register/teacher', component: RegisterTeacher },    //Tanár
    { path: 'kapcsolat', component: Contact },
    { path: 'gyik', component: Faq },
    { path: 'blog', component: Blog },
    { path: 'iskola-valasztas', loadComponent: () => import('./pages/school-select/school-select').then(m => m.SchoolSelect), },
    { path: '**', redirectTo: '' }
];
