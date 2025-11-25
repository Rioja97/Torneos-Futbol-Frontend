import { Component, Input, OnInit, OnChanges, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { EstadisticaService } from '../../../services/estadistica-service';
import { Estadistica } from '../../../models/estadistica.model';

@Component({
  selector: 'app-estadistica-section',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './estadistica-section.html',
  styleUrls: ['./estadistica-section.css']
})
export class EstadisticaSectionComponent implements OnInit, OnChanges {
  @Input() torneoId: number | null = null;
  @Input() jugados: boolean = false; // true si hay partidos jugados

  estadisticas: any[] = [];
  cargando: boolean = false;
  error: string | null = null;

  constructor(private estadisticaService: EstadisticaService) {}

  ngOnInit(): void {
    if (this.torneoId && this.jugados) {
      this.cargarEstadisticas();
    }
  }

  ngOnChanges(changes: SimpleChanges): void {
    console.log('Cambios detectados en estadística-section:', changes);
    if (changes['jugados']) {
      console.log('El estado de jugados cambió a:', this.jugados);
      if (this.torneoId && this.jugados) {
        this.cargarEstadisticas();
      }
    }
  }

  cargarEstadisticas(): void {
    if (!this.torneoId) return;

    this.cargando = true;
    this.error = null;

    this.estadisticaService.getByTorneo(this.torneoId).subscribe({
      next: (data: Estadistica[]) => {
        this.estadisticas = data;
        console.log('Estadísticas cargadas:', data);
        this.cargando = false;
      },
      error: (err: any) => {
        console.error('Error cargando estadísticas:', err);
        this.error = 'No se pudieron cargar las estadísticas';
        this.cargando = false;
      }
    });
  }
}
