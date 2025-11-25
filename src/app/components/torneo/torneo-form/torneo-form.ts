import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Router, ActivatedRoute, RouterLink } from '@angular/router';
import { Torneo } from '../../../models/torneo.model';
import { TorneoService } from '../../../services/torneo-service';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'app-torneo-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule,RouterLink],
  templateUrl: './torneo-form.html',
  styleUrls: ['./torneo-form.css']
})
export class TorneoFormComponent implements OnInit {

  torneoForm!: FormGroup;
  isEditing = false;
  torneoId?: number;

  isSubmitting = false;
  errorMessage = '';

  constructor(
    private fb: FormBuilder,
    private torneoService: TorneoService,
    private router: Router,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {

    this.torneoForm = this.fb.group({
      nombre: ['', Validators.required],
      division: ['', Validators.required],
      cupo: [0, [Validators.required, Validators.min(2)]]
    });

    this.torneoId = Number(this.route.snapshot.paramMap.get('id'));

    if (this.torneoId) {
      this.isEditing = true;
      this.cargarTorneo(this.torneoId);
    }
  }

  cargarTorneo(id: number) {
    this.torneoService.getById(id).subscribe((data: Torneo) => {
      this.torneoForm.patchValue(data);
    });
  }

  onSubmit() {
    if (this.torneoForm.invalid) return;

    this.isSubmitting = true;
    const torneo: Torneo = this.torneoForm.value;

    const request = this.isEditing
      ? this.torneoService.update(this.torneoId!, torneo)
      : this.torneoService.create(torneo);

    request.subscribe({
      next: () => this.router.navigate(['/torneos']),
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
