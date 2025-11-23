import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { EstadisticaService } from '../../../services/estadistica.service';
import { Estadistica } from '../../../models/estadistica.model';

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
    this.cargarEstadisticas();
  }

  cargarEstadisticas() {
    this.estadisticaService.getAll().subscribe((data: Estadistica[]) => {
      this.estadisticas = data;
    });
  }
}
