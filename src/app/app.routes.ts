import { Routes } from '@angular/router';
import { Login } from './components/login/login';
import { authGuard } from './guards/auth-guard';
import { Register } from './components/register/register';
import { Home } from './components/home/home';
import { EquipoForm } from './components/equipo/equipo-form/equipo-form';
import { EquiposList } from './components/equipo/equipo-list/equipo-list';
import { JugadorForm } from './components/jugador/jugador-form/jugador-form';
import { JugadorList } from './components/jugador/jugador-list/jugador-list';

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
        component: EquiposList,
        canActivate: [authGuard]
    },
    {
        path: "equipos/nuevo",
        component: EquipoForm,
        canActivate: [authGuard]
    },
    {
        path: "equipos/editar/:id",
        component: EquipoForm,
        canActivate: [authGuard]
    },
    {
        path: "jugadores/nuevo",
        component: JugadorForm,
        canActivate: [authGuard]
    },
    {
        path: "jugadores/editar/:id",
        component: JugadorForm,
        canActivate: [authGuard]
    },
    {
        path: "jugadores",
        component: JugadorList,
        canActivate: [authGuard]
    },


    // Redirección por defecto
    { path: '', redirectTo: '/login', pathMatch: 'full' }

];
