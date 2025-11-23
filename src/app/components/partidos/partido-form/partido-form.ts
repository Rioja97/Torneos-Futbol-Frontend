import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Router, ActivatedRoute } from '@angular/router';
import { PartidoService } from '../../../services/partido.service';
import { Partido } from '../../../models/partido.model';

@Component({
  selector: 'app-partido-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './partido-form.html',
  styleUrls: ['./partido-form.css']
})
export class PartidoFormComponent implements OnInit {

  partidoForm!: FormGroup;
  isEditing = false;
  partidoId?: number;

  isSubmitting = false;
  errorMessage = '';

  constructor(
    private fb: FormBuilder,
    private partidoService: PartidoService,
    private router: Router,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {

    this.partidoForm = this.fb.group({
      nombreEquipoLocal: ['', Validators.required],
      nombreEquipoVisitante: ['', Validators.required],
      nombreTorneo: ['', Validators.required],
      fecha: ['', Validators.required],
      resultado: [''],
      jugado: [false]
    });

    this.partidoId = Number(this.route.snapshot.paramMap.get('id'));

    if (this.partidoId) {
      this.isEditing = true;
      this.cargarPartido(this.partidoId);
    }
  }

  cargarPartido(id: number) {
    this.partidoService.getById(id).subscribe((data: Partido) => {
      this.partidoForm.patchValue(data);
    });
  }

  onSubmit() {
    if (this.partidoForm.invalid) return;

    this.isSubmitting = true;
    const partido: Partido = this.partidoForm.value;

    const request = this.isEditing
      ? this.partidoService.update(this.partidoId!, partido)
      : this.partidoService.create(partido);

    request.subscribe({
      next: () => this.router.navigate(['/partidos']),
      error: () => {
        this.errorMessage = 'Error al guardar partido';
        this.isSubmitting = false;
      }
    });
  }
}
