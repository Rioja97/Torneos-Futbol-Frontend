import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { Entrenador } from '../../../models/entrenador.model';
import { EntrenadorService } from '../../../services/entrenador-service';

@Component({
  selector: 'app-entrenador-list',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './entrenador-list.html',
  styleUrls: ['./entrenador-list.css']
})
export class EntrenadorListComponent implements OnInit {

  entrenadores: Entrenador[] = [];

  constructor(
    private entrenadorService: EntrenadorService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.cargarEntrenadores();
  }

 

cargarEntrenadores() {
    this.entrenadorService.getAll().subscribe({
      next: (data) => {
        this.entrenadores = data;
        console.log('DATAZOS DE ENTRENADORES:', data); 
      },
      error: (err) => console.error(err)
    });
  }


  editarEntrenador(id: number) {
    this.router.navigate(['/entrenadores/editar', id]);
  }

  eliminarEntrenador(id: number) {
    if(confirm('¿Eliminar entrenador?')){
      this.entrenadorService.delete(id).subscribe(() => this.cargarEntrenadores());
    }
  }
}
