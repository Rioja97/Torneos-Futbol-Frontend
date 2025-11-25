import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Estadistica } from '../../../models/estadistica.model';
import { EstadisticaService } from '../../../services/estadistica-service';

@Component({
  selector: 'app-estadistica-list',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './estadistica-list.html',
  styleUrls: ['./estadistica-list.css']
})
export class EstadisticaListComponent implements OnInit {

  estadisticas: Estadistica[] = [];

  constructor(private estadisticaService: EstadisticaService) {}

  ngOnInit(): void {
    // TODO: Este componente necesita ser actualizado para usar getByTorneo()
    // this.cargarEstadisticas();
  }

  cargarEstadisticas() {
    // El endpoint getAll() no existe en el backend
    // Si necesitas listar estadísticas, usa getByTorneo(torneoId)
    console.warn('EstadisticaListComponent: getAll() no está implementado');
  }
}
