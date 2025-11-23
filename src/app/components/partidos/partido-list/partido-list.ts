import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { PartidoService } from '../../../services/partido.service';
import { Partido } from '../../../models/partido.model';

@Component({
  selector: 'app-partido-list',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './partido-list.html',
  styleUrls: ['./partido-list.css']
})
export class PartidoListComponent implements OnInit {

  partidos: Partido[] = [];

  constructor(
    private partidoService: PartidoService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.cargarPartidos();
  }

  cargarPartidos() {
    this.partidoService.getAll().subscribe((data: Partido[]) => {
      this.partidos = data;
    });
  }

  editarPartido(id: number) {
    this.router.navigate(['/partidos/editar', id]);
  }

  eliminarPartido(id: number) {
    if(confirm('¿Eliminar partido?')){
      this.partidoService.delete(id).subscribe(() => this.cargarPartidos());
    }
  }
}
