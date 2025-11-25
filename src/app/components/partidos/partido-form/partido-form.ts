import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Router, ActivatedRoute } from '@angular/router';
import { Partido } from '../../../models/partido.model';
import { PartidoService } from '../../../services/partido-service';
import { ErrorHandlerService } from '../../../services/error-handler.service';
import { EquipoService } from '../../../services/equipo-service';
import { HttpErrorResponse } from '@angular/common/http';


@Component({
  selector: 'app-partido-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './partido-form.html',
  styleUrls: ['./partido-form.css']
})


export class PartidoFormComponent implements OnInit {
  

  partidoForm: FormGroup;
  equipos: any[] = []; 
  isSubmitting = false; 
  isEditing = false;
  partidoId: number | null = null;
  torneoId: number | null = null; 
errorMessage: any;
errorMessages: string[] | null = null;

  constructor(
    private equipoService: EquipoService,
    private partidoService: PartidoService,
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private errorHandler: ErrorHandlerService
  ) {
    this.partidoForm = this.fb.group({
      fecha: ['', Validators.required],
      equipoLocalId: [null, Validators.required],
      equipoVisitanteId: [null, Validators.required]
    });
  }

  ngOnInit(): void {
    this.cargarListas();

    // 1. Intentamos leer el ID del TORNEO de la URL (para creación)
    const idTorneoParam = this.route.snapshot.paramMap.get('idTorneo');
    if (idTorneoParam) {
        this.torneoId = +idTorneoParam;
    }

    // 2. Intentamos leer el ID del PARTIDO (para edición)
    const idPartidoParam = this.route.snapshot.paramMap.get('id'); // o idPartido
    if (idPartidoParam) {
      this.isEditing = true;
      this.partidoId = +idPartidoParam;
      this.cargarPartido(this.partidoId);
    }
  }
  
  cargarListas() {
    this.equipoService.getAll().subscribe(data => this.equipos = data);
  }
  
  cargarPartido(id: number){
    this.partidoService.getById(id).subscribe((data: Partido) => {
      this.partidoForm.patchValue(data);
    });
  }

  onSubmit() {
    if (this.partidoForm.invalid || this.isSubmitting) return;
      this.isSubmitting = true;
      this.errorMessages = null;


    const val = this.partidoForm.value;
    const partidoParaEnviar = {
        fecha: val.fecha,
        equipoLocalId: Number(val.equipoLocalId),
        equipoVisitanteId: Number(val.equipoVisitanteId)
        // No mandamos torneoId en el body si es creación, va en la URL
    };

    if (this.isEditing && this.partidoId) {
        // Edición: Usa el endpoint general /partidos/{id}
        // Aquí sí quizás necesites mandar el torneoId en el body si tu DTO de update lo pide
        this.partidoService.update(this.partidoId, partidoParaEnviar).subscribe({
            next: () => this.atras(),
            error: (err: HttpErrorResponse) => { // Importar HttpErrorResponse
      console.error('Error del backend:', err);
      this.isSubmitting = false;

      // --- LÓGICA ESTÁNDAR DE ERRORES ---
      if (err.status === 400 || err.error) {
        this.errorMessages = this.errorHandler.formatErrorList(err);
        this.errorMessage = null;
      } else if (err.status === 0) {
        // CASO 2: Servidor apagado o CORS (Lo que te pasó recién)
        this.errorMessage = 'No se pudo conectar con el servidor.';
      } else {
        // CASO 3: Error inesperado no controlado
        this.errorMessage = 'Ocurrió un error inesperado. Intente nuevamente.';
      }
    }
        });
    } else {
        // Creación: Usa el endpoint del torneo /torneos/{id}/partidos
        if (this.torneoId) {
          this.partidoService.crearPartidoEnTorneo(this.torneoId, partidoParaEnviar).subscribe({
            next: () => this.atras(),
            error: (err: HttpErrorResponse) => {
              console.error('Error del backend (crear):', err);
              this.isSubmitting = false;

              // Mostrar errores de validación devueltos por el backend (400)
              if (err.status === 400 || err.error) {
                this.errorMessages = this.errorHandler.formatErrorList(err);
                this.errorMessage = null;
                return;
              }

              if (err.status === 0) {
                this.errorMessage = 'No se pudo conectar con el servidor.';
                return;
              }

              // Error inesperado
              this.errorMessage = 'Ocurrió un error inesperado. Intente nuevamente.';
            }
          });
        } else {
            console.error("No tengo el ID del torneo para crear el partido");
        }
    }
  }

  atras() {
      // Volver a la vista del torneo
      if (this.torneoId) {
          this.router.navigate(['/torneos', this.torneoId, 'detalle']); 
      } else {
          this.router.navigate(['/torneos']);
      }
  }
}