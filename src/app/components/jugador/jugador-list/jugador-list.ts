import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Jugador } from '../../../models/jugador.model';
import { JugadorService } from '../../../services/jugador-service';
import { Router, RouterLink } from '@angular/router';
import { NavbarComponent } from '../../shared/navbar/navbar.component';
import { AuthService } from '../../../services/authService';

@Component({
  selector: 'app-jugador-list',
  standalone: true,
  imports: [CommonModule, RouterLink, NavbarComponent],
  templateUrl: './jugador-list.html',
  styleUrls: ['./jugador-list.css']
})
export class JugadorList implements OnInit {
  
  jugadores: Jugador[] = [];

  constructor(
    private jugadorService: JugadorService,
    private router: Router,
    public authService: AuthService
  ) {}

  ngOnInit(): void {
    this.cargarJugadores();
  }

  cargarJugadores() {
    this.jugadorService.getAll().subscribe({
      next: (data) => {
        this.jugadores = data;
        console.log(data);
      },
      error: (err) => console.error(err)
    });
  }

  editarJugador(id: number) {
    this.router.navigate(['/jugadores/editar', id]);
  }

  eliminarJugador(id: number) {
    if(confirm('¿Borrar jugador?')) {
      this.jugadorService.delete(id).subscribe(() => {
        this.jugadores = this.jugadores.filter(j => j.id !== id);
      });
    }
  }
}