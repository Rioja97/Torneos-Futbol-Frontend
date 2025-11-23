import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { Entrenador } from '../../../models/entrenador.model';
import { EntrenadorService } from '../../../services/entrenador-service';

@Component({
  selector: 'app-entrenador-list',
  standalone: true,
  imports: [CommonModule],
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
  this.entrenadorService.getAll().subscribe((data: Entrenador[]) => {
    this.entrenadores = data;
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
