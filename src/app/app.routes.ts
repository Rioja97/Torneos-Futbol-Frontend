import { Routes } from '@angular/router';
import { Login } from './components/login/login';
import { authGuard } from './guards/auth-guard';
import { Equipos } from './components/equipos/equipos';
import { Register } from './components/register/register';
import { Home } from './components/home/home';

export const routes: Routes = [
    {
        path: 'login', 
        component: Login
    },
    {
        path: 'register',
        component: Register
    },
    {
        path: 'home',
        component: Home,
        canActivate: [authGuard]
    },
    {
        path: 'equipos', 
        component: Equipos,
        canActivate: [authGuard]
    },


    // Redirección por defecto
    { path: '', redirectTo: '/login', pathMatch: 'full' }

];
