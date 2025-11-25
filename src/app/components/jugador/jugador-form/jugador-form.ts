import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { Equipo } from '../../../models/equipo.model';
import { JugadorService } from '../../../services/jugador-service';
import { ErrorHandlerService } from '../../../services/error-handler.service';
import { EquipoService } from '../../../services/equipo-service';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'app-jugador-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  templateUrl: './jugador-form.html',
  styleUrl: './jugador-form.css',
})
export class JugadorForm {

  errorMessage: string | null = null;
  errorMessages: string[] | null = null;
  jugadorForm: FormGroup;
  isSubmitting = false;
  isEditing = false;
  idJugador: number | null = null;

  equipos: Equipo[] = [];

  constructor(
    private fb: FormBuilder,
    private jugadorService: JugadorService,
    private equipoService: EquipoService, // <--- Inyectamos
    private router: Router,
    private route: ActivatedRoute,
    private errorHandler: ErrorHandlerService
  ) {
    this.jugadorForm = this.fb.group({
      nombre: ['', [Validators.required]],
      edad: [18, [Validators.required, Validators.min(16)]], // Valor por defecto 18
      posicion: ['', [Validators.required]],
      dorsal: [1, [Validators.required, Validators.min(1), Validators.max(99)]],
      // Este campo guardará el ID del equipo seleccionado
      equipoId: [null, [Validators.required]] 
    });
  }

  ngOnInit(): void {
    // 1. Cargar la lista de equipos SIEMPRE
    this.cargarEquipos();

    // 2. Verificar si es edición
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.isEditing = true;
      this.idJugador = +id;
      this.cargarDatosJugador(this.idJugador);
    }
  }

  cargarEquipos() {
    this.equipoService.getAll().subscribe({
      next: (data) => {
        this.equipos = data; // Guardamos los equipos en la variable
      },
      error: (err) => console.error('Error al cargar equipos', err)
    });
  }

  cargarDatosJugador(id: number) {
    this.jugadorService.getById(id).subscribe({
      next: (data) => {
        // Rellenamos el form
        this.jugadorForm.patchValue({
          nombre: data.nombre,
          edad: data.edad,
          posicion: data.posicion,
          dorsal: data.dorsal,
          // Aquí asumimos que el GET devuelve 'equipoId'. 
          // Si devuelve un objeto 'equipo', sería: data.equipo.id
          equipoId: data.equipoId 
        });
      },
      error: (err) => console.error('Error al cargar jugador', err)
    });
  }


  onSubmit() {
    if (this.jugadorForm.invalid || this.isSubmitting) return;

    this.isSubmitting = true;
    this.errorMessage = null; // 1. Limpiamos errores viejos
    this.errorMessages = null;
    // Aquí no hace falta transformación manual compleja
    // porque el form ya tiene el formato { nombre: '...', equipoId: 5 }
    // que es lo que tu back espera.
    const jugadorParaEnviar = this.jugadorForm.value;

    if (this.isEditing && this.idJugador) {
      this.jugadorService.update(this.idJugador, jugadorParaEnviar).subscribe({
        next: () => this.router.navigate(['/jugadores']),
        error: () => this.isSubmitting = false
      });
    } else {
      this.jugadorService.create(jugadorParaEnviar).subscribe({
        next: () => this.router.navigate(['/jugadores']),
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
    }
  }
}
