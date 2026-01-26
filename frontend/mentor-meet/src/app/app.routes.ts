import { Routes } from '@angular/router';
import { LandingPage } from './landing/landing-page/landing-page';
import { Login } from './pages/login/login';
import { Contact } from './pages/contact/contact';
import { Faq } from './pages/faq/faq';
import { Blog } from './pages/blog/blog';
import { StudentDashboard } from './dashboard/student-dashboard/student-dashboard';
import { TeacherDashboardComponent } from './dashboard/teacher-dashboard/teacher-dashboard';
import { RegisterChoice } from './pages/register-choice/register-choice';
import { RegisterStudent } from './pages/register-student/register-student';
import { RegisterTeacher } from './pages/register-teacher/register-teacher';
import { TeacherProfileEditComponent } from './dashboard/teacher-profile-edit/teacher-profile-edit';
import { StudentProfileEdit } from './dashboard/student-profile-edit/student-profile-edit';
import { authGuard } from './shared/guards/auth-guard';
import { UserListComponent } from './user-list/user-list';
import { DashboardLayoutComponent } from './dashboard/dashboard-layout/dashboard-layout'; // <--- Importáld be!
import { Friends } from './pages/friends/friends';

export const routes: Routes = [
    // PUBLIKUS OLDALAK (Nincs navbar/sidebar)
    { path: '', component: LandingPage },
    { path: 'login', component: Login },
    { path: 'register', component: RegisterChoice },
    { path: 'register/student', component: RegisterStudent },
    { path: 'register/teacher', component: RegisterTeacher },
    { path: 'kapcsolat', component: Contact },
    { path: 'gyik', component: Faq },
    { path: 'blog', component: Blog },
    { path: 'iskola-valasztas', loadComponent: () => import('./pages/school-select/school-select').then(m => m.SchoolSelect), },

    // VÉDETT OLDALAK (Itt jelenik meg a DashboardLayout, benne a navbarral)
    {
        path: '',
        component: DashboardLayoutComponent,
        canActivate: [authGuard],
        children: [
            { path: 'student-dashboard', component: StudentDashboard },
            { path: 'teacher-dashboard', component: TeacherDashboardComponent },
            { path: 'teacher-profile-edit', component: TeacherProfileEditComponent },
            { path: 'student-profile-edit', component: StudentProfileEdit },
            { path: 'user-list', component: UserListComponent },
            {path: 'friends', component: Friends}
        ]
    },

    // Minden más esetben irány a főoldal
    { path: '**', redirectTo: '' }
];