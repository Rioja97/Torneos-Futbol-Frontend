import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, Router } from '@angular/router'; // Importamos Router
import { EquipoService } from '../../../services/equipo-service';
import { Equipo } from '../../../models/equipo.model';
import { NavbarComponent } from '../../shared/navbar/navbar.component';
import { AuthService } from '../../../services/authService';


@Component({
  selector: 'app-equipo-list',
  standalone: true,
  imports: [CommonModule, RouterLink, NavbarComponent],
  templateUrl: './equipo-list.html',
  styleUrls: ['./equipo-list.css'] // Corregí styleUrl a styleUrls (plural es más común aunque ambos funcionan en v17+)
})
export class EquiposList implements OnInit {
  
  equipos: Equipo[] = []; 

  constructor(
    private equipoService: EquipoService,
    private router: Router, // Inyectamos el Router para poder navegar
    public authService: AuthService
  ) {}

  ngOnInit(): void {
    this.cargarEquipos();
  }

  cargarEquipos() {
    this.equipoService.getAll().subscribe({
      next: (data) => {
        this.equipos = data;
        console.log('Equipos cargados:', data);
      },
      error: (err) => {
        console.error('Error al cargar equipos:', err);
      }
    });
  }

  // --- MÉTODOS DE ACCIÓN ---

  editarEquipo(id: number) {
    // Navegamos a la ruta de edición pasando el ID en la URL
    // Esto coincidirá con la ruta 'equipos/editar/:id' en app.routes.ts
    this.router.navigate(['/equipos/editar', id]);
  }

  eliminarEquipo(id: number) {
    // 1. Preguntamos confirmación (Muy importante para no borrar por error)
    if (confirm('¿Estás seguro de que deseas eliminar este equipo?')) {
      
      // 2. Llamamos al servicio
      this.equipoService.delete(id).subscribe({
        next: () => {
          console.log('Equipo eliminado con éxito');
          
          // 3. TRUCO VISUAL: Actualizamos la tabla sin recargar la página
          // "Dejame solo los equipos cuyo ID sea distinto al que acabo de borrar"
          this.equipos = this.equipos.filter(e => e.id !== id);
          
          // Opcional: Mostrar una alerta o toast
          // alert('Equipo eliminado correctamente'); 
        },
        error: (err) => {
          console.error('Error al eliminar:', err);
          alert('No se pudo eliminar el equipo. Puede que tenga jugadores asociados.');
        }
      });
    }
  }
}