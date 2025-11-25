import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { Torneo } from '../../../models/torneo.model';
import { TorneoService } from '../../../services/torneo-service';
import { NavbarComponent } from '../../shared/navbar/navbar.component';
import { AuthService } from '../../../services/authService';

@Component({
  selector: 'app-torneo-list',
  standalone: true,
  imports: [CommonModule, RouterModule, NavbarComponent],
  templateUrl: './torneo-list.html',
  styleUrls: ['./torneo-list.css']
})
export class TorneoListComponent implements OnInit {

  torneos: Torneo[] = [];

  constructor(
    private torneoService: TorneoService,
    private router: Router,
    public authService: AuthService
  ) {}

  ngOnInit(): void {
    this.cargarTorneos();
  }

  cargarTorneos() {
    this.torneoService.getAll().subscribe((data: Torneo[]) => {
      this.torneos = data;
    });
  }

  editarTorneo(id: number) {
    this.router.navigate(['/torneos/editar', id]);
  }

  eliminarTorneo(id: number) {
    if(confirm('¿Eliminar torneo?')){
      this.torneoService.delete(id).subscribe(() => this.cargarTorneos());
    }
  }
}
