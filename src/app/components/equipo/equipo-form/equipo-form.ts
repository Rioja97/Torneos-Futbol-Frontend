import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { EquipoService } from '../../../services/equipo-service';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'app-equipo-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  templateUrl: './equipo-form.html',
  styleUrl: './equipo-form.css',
})
export class EquipoForm {

  errorMessage: string | null = null;
  equipoForm: FormGroup;
  isSubmitting = false;

  isEditing = false;
  idEquipo: number | null = null;

  constructor(
    private fb: FormBuilder,
    private equipoService: EquipoService,
    private router: Router,
    private route: ActivatedRoute
  ){
    this.equipoForm = this.fb.group({
      nombre: ['', [Validators.required]],
      ciudad: ['', [Validators.required]],
      nombreEstadio: ['', [Validators.required]],
      capacidadEstadio: [0, [Validators.required, Validators.min(100)]]
    });
  }

  ngOnInit(): void{
    const id = this.route.snapshot.paramMap.get('id')

    if (id) {
      // MODO EDICIÓN
      this.isEditing = true;
      this.idEquipo = +id; // El '+' convierte el string a numero
      this.cargarDatosEquipo(this.idEquipo);
    }
  }

  cargarDatosEquipo(id: number) {
    this.equipoService.getById(id).subscribe({
      next: (data) => {
        // Rellenamos el formulario con los datos que vienen del Backend
        // Como tu GET devuelve plano (nombreEstadio), calza perfecto con el form
        this.equipoForm.patchValue({
          nombre: data.nombre,
          ciudad: data.ciudad,
          nombreEstadio: data.nombreEstadio,
          capacidadEstadio: data.capacidadEstadio
        });
      },
      error: (err) => console.error('Error al cargar equipo', err)
    });
  }

  onSubmit(){

    if(this.equipoForm.invalid || this.isSubmitting) return;

    this.isSubmitting = true;
    this.errorMessage = null; // 1. Limpiamos errores viejos
    const equipoParaEnviar = {
      nombre: this.equipoForm.value.nombre,
      ciudad: this.equipoForm.value.ciudad,
      estadio: {
        nombre: this.equipoForm.value.nombreEstadio,
        capacidad: this.equipoForm.value.capacidadEstadio
      }
    };

    if (this.isEditing && this.idEquipo) {
      // 2a. MODO EDICIÓN: Llamamos a update
      this.equipoService.update(this.idEquipo, equipoParaEnviar).subscribe({
        next: () => {
          console.log('¡Equipo actualizado!');
          this.router.navigate(['/equipos']);
        },
        error: (err) => {
          console.error(err);
          this.isSubmitting = false;
          if (err.error && err.error.message) {
            this.errorMessage = err.error.message;
          } else {
            this.errorMessage = 'Ocurrió un error inesperado. Intente nuevamente.';
          }
        }
      });
    } else {
      // 2b. MODO CREACIÓN: Llamamos a create (Lo que ya tenías)
      this.equipoService.create(equipoParaEnviar).subscribe({
        next: () => {
          console.log('¡Equipo creado!');
          this.router.navigate(['/equipos']);
        },
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
}
