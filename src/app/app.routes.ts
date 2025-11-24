import { Routes } from '@angular/router';
import { Login } from './components/login/login';
import { Register } from './components/register/register';
import { Home } from './components/home/home';
import { EquiposList } from './components/equipo/equipo-list/equipo-list';
import { EquipoForm } from './components/equipo/equipo-form/equipo-form';
import { JugadorList } from './components/jugador/jugador-list/jugador-list';
import { JugadorForm } from './components/jugador/jugador-form/jugador-form';
import { EntrenadorListComponent } from './components/entrenador/entrenador-list/entrenador-list';
import { EntrenadorFormComponent } from './components/entrenador/entrenador-form/entrenador-form';
import { authGuard } from './guards/auth-guard';

export const routes: Routes = [
    // Ruta por defecto
    { path: '', redirectTo: 'login', pathMatch: 'full' },

    // RUTA LOGIN EXPLÍCITA
    { path: 'login', component: Login },
    { path: 'register', component: Register },

    // RUTAS PROTEGIDAS (SIN GUARD POR AHORA - SOLO PARA PROBAR)
    { path: 'home', component: Home },
    
    { path: 'equipos', component: EquiposList },
    { path: 'equipos/nuevo', component: EquipoForm },
    { path: 'equipos/editar/:id', component: EquipoForm },

    { path: 'jugadores', component: JugadorList },
    { path: 'jugadores/nuevo', component: JugadorForm },
    { path: 'jugadores/editar/:id', component: JugadorForm },

    { path: 'entrenadores', component: EntrenadorListComponent },
    { path: 'entrenadores/nuevo', component: EntrenadorFormComponent },
    { path: 'entrenadores/editar/:id', component: EntrenadorFormComponent }
];