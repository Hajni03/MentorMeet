import { Routes } from '@angular/router';
import { LandingPage } from './landing/landing-page/landing-page';
import { Blog } from './pages/blog/blog';
import { Contact } from './pages/contact/contact';
import { Faq } from './pages/faq/faq';
import { Login } from './pages/login/login';
import { RegisterChoice } from './pages/register-choice/register-choice';
import { RegisterStudent } from './pages/register-student/register-student';
import { RegisterTeacher } from './pages/register-teacher/register-teacher';
import { DashboardLayoutComponent } from './dashboard/dashboard-layout/dashboard-layout';
import { authGuard } from './shared/guards/auth-guard';
import { StudentDashboard } from './dashboard/student-dashboard/student-dashboard';
import { TeacherDashboardComponent } from './dashboard/teacher-dashboard/teacher-dashboard';
import { TeacherProfileEditComponent } from './dashboard/teacher-profile-edit/teacher-profile-edit';
import { StudentProfileEdit } from './dashboard/student-profile-edit/student-profile-edit';
import { UserListComponent } from './user-list/user-list';
import { Friends } from './pages/friends/friends';
import { Chat } from './dashboard/chat/chat/chat';
import { UserProfile } from './pages/user-profile/user-profile';

export const routes: Routes = [
    // 1. PUBLIKUS OLDALAK
    { path: '', component: LandingPage, pathMatch: 'full' }, // pathMatch: 'full' fontos!
    { path: 'login', component: Login },
    { path: 'register', component: RegisterChoice },
    { path: 'register/student', component: RegisterStudent },
    { path: 'register/teacher', component: RegisterTeacher },
    { path: 'kapcsolat', component: Contact },
    { path: 'gyik', component: Faq },
    { path: 'blog', component: Blog },
    { path: 'iskola-valasztas', loadComponent: () => import('./pages/school-select/school-select').then(m => m.SchoolSelect), },

    // 2. VÉDETT OLDALAK (A DashboardLayoutComponent csak egyszer szerepeljen szülőként)
    {
        path: '',
        component: DashboardLayoutComponent,
        canActivate: [authGuard],
        children: [
            // Fontos: ezeknek a komponenseknek a saját HTML fájljában 
            // TILOS szerepelnie a sidebar vagy a dashboard-layout kódjának!
            { path: 'student-dashboard', component: StudentDashboard },
            { path: 'teacher-dashboard', component: TeacherDashboardComponent },
            { path: 'teacher-profile-edit', component: TeacherProfileEditComponent },
            { path: 'student-profile-edit', component: StudentProfileEdit },
            { path: 'user-list', component: UserListComponent },
            { path: 'friends', component: Friends },
            { path: 'chat', component: Chat },
            {path: 'user-profile/:id', component: UserProfile}
        ]
    },

    { path: '**', redirectTo: '' }
];