import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Jugador } from '../../../models/jugador.model';
import { Torneo } from '../../../models/torneo.model';
import { Estadistica } from '../../../models/estadistica.model';
import { EstadisticaService } from '../../../services/estadistica-service';
import { JugadorService } from '../../../services/jugador-service';
import { TorneoService } from '../../../services/torneo-service';

@Component({
  selector: 'app-estadistica-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './estadistica-form.html',
  styleUrls: ['./estadistica-form.css']
})
export class EstadisticaFormComponent implements OnInit {

  form!: FormGroup;
  jugadores: Jugador[] = [];
  torneos: Torneo[] = [];
  resultado?: Estadistica;

  constructor(
    private fb: FormBuilder,
    private estadisticaService: EstadisticaService,
    private jugadorService: JugadorService,
    private torneoService: TorneoService
  ) {}

  ngOnInit(): void {
    this.form = this.fb.group({
      jugadorId: [null, Validators.required],
      torneoId: [null]
    });

    this.cargarJugadores();
    this.cargarTorneos();
  }

  cargarJugadores() {
    this.jugadorService.getAll().subscribe((data: Jugador[]) => {
      this.jugadores = data;
    });
  }

  cargarTorneos() {
    this.torneoService.getAll().subscribe((data: Torneo[]) => {
      this.torneos = data;
    });
  }

  buscarEstadisticas() {
    const jugadorId = this.form.value.jugadorId;
    const torneoId = this.form.value.torneoId;

    if (!jugadorId) return;

    if (torneoId) {
      this.estadisticaService
        .getByJugadorYTorneo(jugadorId, torneoId)
        .subscribe((data: Estadistica) => {
          this.resultado = data;
        });
    } else {
      this.estadisticaService
        .getByJugador(jugadorId)
        .subscribe((data: Estadistica) => {
          this.resultado = data;
        });
    }
  }
}
