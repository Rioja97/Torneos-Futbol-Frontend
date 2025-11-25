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
import { adminGuard } from './guards/admin.guard';
import { loginGuard } from './guards/login.guard';
import { TorneoListComponent } from './components/torneo/torneo-list/torneo-list';
import { TorneoFormComponent } from './components/torneo/torneo-form/torneo-form';
import { PartidoFormComponent } from './components/partidos/partido-form/partido-form';
import { TorneoDetailComponent } from './components/torneo/torneo-detail/torneo-detail';
import { PartidoListComponent } from './components/partidos/partido-list/partido-list';

export const routes: Routes = [
    // Ruta por defecto
    { path: '', redirectTo: 'login', pathMatch: 'full' },

    // RUTA LOGIN EXPLÍCITA
    { path: 'login', component: Login, canActivate: [loginGuard] },
    { path: 'register', component: Register, canActivate: [loginGuard] },

    // RUTAS PROTEGIDAS (PROTEGEMOS HOME PARA QUE NO SEA ACCESIBLE SIN TOKEN)
    { path: 'home', component: Home, canActivate: [authGuard] },
    
    //RUTAS PARA ENTIDADES
    { path: 'equipos', component: EquiposList, canActivate: [authGuard] },
    { path: 'equipos/nuevo', component: EquipoForm, canActivate: [authGuard, adminGuard] },
    { path: 'equipos/editar/:id', component: EquipoForm, canActivate: [authGuard, adminGuard] },

    { path: 'jugadores', component: JugadorList, canActivate: [authGuard] },
    { path: 'jugadores/nuevo', component: JugadorForm, canActivate: [authGuard, adminGuard] },
    { path: 'jugadores/editar/:id', component: JugadorForm, canActivate: [authGuard, adminGuard] },

    { path: 'entrenadores', component: EntrenadorListComponent, canActivate: [authGuard] },
    { path: 'entrenadores/nuevo', component: EntrenadorFormComponent, canActivate: [authGuard, adminGuard] },
    { path: 'entrenadores/editar/:id', component: EntrenadorFormComponent, canActivate: [authGuard, adminGuard] },

    { path: 'torneos', component:TorneoListComponent, canActivate: [authGuard] },
    { path: 'torneos/nuevo', component:TorneoFormComponent, canActivate: [authGuard, adminGuard] },
    { path: 'torneos/editar/:id', component:TorneoFormComponent, canActivate: [authGuard, adminGuard] },

    { path: 'torneos/:id/detalle', component: TorneoDetailComponent, canActivate: [authGuard] },
    { path: 'torneos/:idTorneo/partidos/nuevo', component: PartidoFormComponent, canActivate: [authGuard, adminGuard] },
    { path: 'torneos/:id/partidos', component: PartidoListComponent, canActivate: [authGuard] },

    { path: 'partidos/editar/:id', component: PartidoFormComponent, canActivate: [authGuard, adminGuard] },

    //{ path: '**', redirectTo: 'login' } // Ruta comodín para redirigir a login en caso de ruta no encontrada
];