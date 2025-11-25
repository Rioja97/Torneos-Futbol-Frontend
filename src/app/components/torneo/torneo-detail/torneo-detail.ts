import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { TorneoService } from '../../../services/torneo-service';
import { PartidoService } from '../../../services/partido-service';
import { RegistrarResultadoModalComponent } from '../../../components/partidos/registrar-resultado-modal/registrar-resultado-modal';
import { NavbarComponent } from '../../shared/navbar/navbar.component';
import { EstadisticaSectionComponent } from '../../estadistica/estadistica-section/estadistica-section';

@Component({
  selector: 'app-torneo-detail',
  standalone: true,
  imports: [CommonModule, RouterLink, NavbarComponent, EstadisticaSectionComponent],
  templateUrl: './torneo-detail.html',
  styleUrls: ['./torneo-detail.css']
})
export class TorneoDetailComponent implements OnInit {

  torneo: any = null;
  partidos: any[] = [];
  torneoId: number | null = null;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private torneoService: TorneoService,
    private partidoService: PartidoService,
    private dialog: MatDialog
  ) {}

  ngOnInit(): void {
    const idParam = this.route.snapshot.paramMap.get('id');
    
    if (idParam) {
      this.torneoId = +idParam;
      this.cargarDatos();
    }
  }

  cargarDatos() {
    if (!this.torneoId) return;

    this.torneoService.getById(this.torneoId).subscribe({
      next: (data) => this.torneo = data,
      error: (err) => console.error('Error cargando torneo', err)
    });

    this.partidoService.getPartidosPorTorneo(this.torneoId).subscribe({
      next: (data) => {
        this.partidos = data;
        console.log('Partidos:', data);
      },
      error: (err) => console.error('Error cargando partidos', err)
    });
  }

  get hayPartidosJugados(): boolean {
    return this.partidos.some(p => p.jugado === true);
  }

  abrirRegistroResultado(partido: any) {
    const dialogRef = this.dialog.open(RegistrarResultadoModalComponent, {
      width: '900px',
      disableClose: true,
      data: { partido: partido }
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log('Modal cerrado con resultado:', result);
      if (result) {
        console.log('Recargando datos del torneo...');
        this.cargarDatos();
      }
    });
  }

  eliminarPartido(idPartido: number) {
    if (!this.torneoId) return;

    if (confirm('¿Estás seguro de eliminar este partido?')) {
      this.partidoService.eliminarPartidoDeTorneo(this.torneoId, idPartido).subscribe({
        next: () => {
          this.partidos = this.partidos.filter(p => p.id !== idPartido);
        },
        error: (err) => alert('Error al eliminar el partido.')
      });
    }
  }
}