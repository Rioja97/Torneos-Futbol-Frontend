import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Router, ActivatedRoute, RouterLink } from '@angular/router';
import { Entrenador } from '../../../models/entrenador.model';
import { Equipo } from '../../../models/equipo.model';
import { EntrenadorService } from '../../../services/entrenador-service';
import { EquipoService } from '../../../services/equipo-service';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'app-entrenador-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  templateUrl: './entrenador-form.html',
  styleUrls: ['./entrenador-form.css']
})
export class EntrenadorFormComponent implements OnInit {

  entrenadorForm!: FormGroup;
  equipos: Equipo[] = [];
  isEditing = false;
  entrenadorId?: number;

  isSubmitting = false;
  errorMessage = '';

  constructor(
    private fb: FormBuilder,
    private entrenadorService: EntrenadorService,
    private equipoService: EquipoService,
    private router: Router,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.entrenadorForm = this.fb.group({
      nombre: ['', Validators.required],
      experiencia: [0, [Validators.required, Validators.min(0)]],
      equipoId: [null, Validators.required]
    });

    this.cargarEquipos();

    this.entrenadorId = Number(this.route.snapshot.paramMap.get('id'));
    if (this.entrenadorId) {
      this.isEditing = true;
      this.cargarEntrenador(this.entrenadorId);
    }
  }

  

cargarEquipos() {
  this.equipoService.getAll().subscribe((data: Equipo[]) => {
    this.equipos = data;
  });
}


cargarEntrenador(id: number) {
  this.entrenadorService.getById(id).subscribe((data: Entrenador) => {
    this.entrenadorForm.patchValue(data);
  });
}


  onSubmit() {
    if (this.entrenadorForm.invalid) return;

    this.isSubmitting = true;

    const formValue = this.entrenadorForm.value;

    const entrenadorParaEnviar = {
      nombre: formValue.nombre,
      experiencia: formValue.experiencia,
      equipoId: Number(formValue.equipoId),
      nombreEquipo: formValue.nombreEquipo // <--- Convertimos a Número por seguridad
    };

    console.log('Enviando:', entrenadorParaEnviar);

    const request = this.isEditing
      ? this.entrenadorService.update(this.entrenadorId!, entrenadorParaEnviar)
      : this.entrenadorService.create(entrenadorParaEnviar);

    request.subscribe({
      next: () => this.router.navigate(['/entrenadores']),
      error: (err: HttpErrorResponse) => { // Importar HttpErrorResponse
      console.error('Error del backend:', err);
      this.isSubmitting = false;

      // --- LÓGICA ESTÁNDAR DE ERRORES ---
      if (err.error && err.error.message) {
        // CASO 1: Error controlado por tu GlobalExceptionHandler
        // (Ej: "Ya existe ese nombre", "Falta el ID", etc.)
        this.errorMessage = err.error.message;
      } else if (err.status === 0) {
        // CASO 2: Servidor apagado o CORS (Lo que te pasó recién)
        this.errorMessage = 'No se pudo conectar con el servidor.';
      } else {
        // CASO 3: Error inesperado no controlado
        this.errorMessage = 'Ocurrió un error inesperado. Intente nuevamente.';
      }
    }
    });
  }
}
