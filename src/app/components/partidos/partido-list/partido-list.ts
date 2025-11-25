import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { MatIcon } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatTooltipModule } from '@angular/material/tooltip';
import { PartidoService } from '../../../services/partido-service';
import { RegistrarResultadoModalComponent } from '../registrar-resultado-modal/registrar-resultado-modal';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { AuthService } from '../../../services/authService';

@Component({
  selector: 'app-partido-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, MatIcon, MatButtonModule, MatTooltipModule],
  templateUrl: './partido-list.html',
  styleUrls: ['./partido-list.css']
})

export class PartidoListComponent implements OnInit {
  partidos: any[] = [];
  torneoId: number = 0;

  constructor(
    private partidoService: PartidoService,
    private route: ActivatedRoute,
    private dialog: MatDialog,
    public authService: AuthService
  ) {}

  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      const idStr = params.get('id');
      if (idStr) {
        this.torneoId = +idStr;
        this.cargarPartidos();
      }
    });
  }

  cargarPartidos() {
    this.partidoService.getPartidosPorTorneo(this.torneoId).subscribe({
      next: (data) => {
        this.partidos = data;
      },
      error: (err) => console.error('Error cargando partidos:', err)
    });
  }

  abrirRegistroResultado(partido: any) {
    const dialogRef = this.dialog.open(RegistrarResultadoModalComponent, {
      width: '900px',
      disableClose: true,
      data: { partido: partido }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.cargarPartidos();
      }
    });
  }
}