import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormArray, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { MAT_DIALOG_DATA, MatDialogRef, MatDialogActions } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { forkJoin } from 'rxjs';
import { PartidoService } from '../../../services/partido-service';
import { JugadorService } from '../../../services/jugador-service';
import { ResultadoPartidoDTO } from '../../../models/resultadoPartidoDTO';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';


@Component({
  selector: 'app-registrar-resultado-modal',
  templateUrl: './registrar-resultado-modal.html',
  standalone: true,
  styleUrls: ['./registrar-resultado-modal.css'],
  imports: [    ReactiveFormsModule,
                CommonModule,
                MatDialogActions,
                MatButtonModule,
                MatFormFieldModule,
                MatInputModule,
                MatCheckboxModule,
                MatProgressSpinnerModule]
            })
export class RegistrarResultadoModalComponent implements OnInit {
  form: FormGroup;
  loading = true;

  constructor(
    private fb: FormBuilder,
    private partidoService: PartidoService,
    private jugadorService: JugadorService,
    @Inject(MatDialogRef) public dialogRef: MatDialogRef<RegistrarResultadoModalComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { partido: any }
  ) {
    // Inicializamos el formulario
    // Nota: 'resultado' no está aquí, usaremos golesLocal y golesVisitante para construirlo
    this.form = this.fb.group({
      golesLocal: [0, [Validators.required, Validators.min(0)]],
      golesVisitante: [0, [Validators.required, Validators.min(0)]],
      estadisticas: this.fb.array([])
    });
  }

  ngOnInit(): void {
    this.cargarJugadores();
  }

  get estadisticasArr() {
    return this.form.get('estadisticas') as FormArray;
  }

  cargarJugadores() {
    // Obtener los IDs de los equipos del partido
    const idLocal = this.data.partido.equipoLocalId;
    const idVisitante = this.data.partido.equipoVisitanteId;

    // También captura los nombres planos para pasarlos al form
    const nombreLocal = this.data.partido.nombreEquipoLocal;
    const nombreVisitante = this.data.partido.nombreEquipoVisitante;

    // Validación de seguridad
    if (!idLocal || !idVisitante) {
        console.error('Faltan IDs de equipos en el partido:', this.data.partido);
        this.loading = false;
        return;
    }

    console.log('Cargando jugadores para equipos:', idLocal, idVisitante);

    this.loading = true;
    forkJoin({
      local: this.jugadorService.getJugadoresPorEquipo(idLocal),
      visitante: this.jugadorService.getJugadoresPorEquipo(idVisitante)
    }).subscribe({
      next: (res) => {
        console.log('Jugadores locales:', res.local);
        console.log('Jugadores visitantes:', res.visitante);
        
        // Agregar jugadores del equipo local
        res.local.forEach(j => this.agregarJugadorAlForm(j, nombreLocal));
        
        // Agregar jugadores del equipo visitante
        res.visitante.forEach(j => this.agregarJugadorAlForm(j, nombreVisitante));
        
        this.loading = false;
      },
      error: (err) => {
        console.error('Error cargando jugadores:', err);
        this.loading = false;
      }
    });
}

  agregarJugadorAlForm(jugador: any, nombreEquipo: string) {
    const group = this.fb.group({
      jugadorId: [jugador.id], // Importante: Este dato se envía
      nombreJugador: [jugador.nombre], // Solo visual
      nombreEquipo: [nombreEquipo],    // Solo visual
      
      // Inputs de estadísticas (inicializados en 0)
      goles: [0, [Validators.min(0)]],
      asistencias: [0, [Validators.min(0)]],
      tarjetasAmarillas: [0, [Validators.min(0), Validators.max(2)]],
      tarjetasRojas: [0, [Validators.min(0), Validators.max(1)]],
      
      // Checkbox opcional para marcar si jugó (útil visualmente)
      participo: [false] 
    });

    this.estadisticasArr.push(group);
  }

  guardar() {
    if (this.form.invalid) {
      this.form.markAllAsTouched(); // Marca errores en rojo si los hay
      return;
    }

    const formValue = this.form.value;

    // 1. Construir el string de resultado "X-Y"
    const resultadoString = `${formValue.golesLocal}-${formValue.golesVisitante}`;

    // 2. Filtrar y mapear las estadísticas
    // Solo enviamos jugadores que tengan "participo" en true O alguna estadística > 0
    const estadisticasFiltradas = formValue.estadisticas
      .filter((s: any) => s.participo || s.goles > 0 || s.asistencias > 0 || s.tarjetasAmarillas > 0 || s.tarjetasRojas > 0)
      .map((s: any) => ({
        jugadorId: s.jugadorId,
        goles: s.goles,
        asistencias: s.asistencias,
        tarjetasAmarillas: s.tarjetasAmarillas,
        tarjetasRojas: s.tarjetasRojas
      }));

    // 3. Armar el DTO final
    const dto: ResultadoPartidoDTO = {
      resultado: resultadoString,
      estadisticasJugadores: estadisticasFiltradas
    };

    // 4. Llamar al servicio
    this.partidoService.registrarResultado(this.data.partido.id, dto).subscribe({
      next: () => {
        console.log('Resultado guardado exitosamente:', dto);
        // Esperar un poco para asegurar que el backend terminó
        setTimeout(() => {
          this.dialogRef.close(true); // Cerramos devolviendo true (éxito)
        }, 500);
      },
      error: (err) => {
        console.error('Error al guardar resultado:', err);
        alert('Error al guardar el resultado: ' + err.message);
      }
    });
  }
}  