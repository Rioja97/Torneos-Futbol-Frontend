import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Estadistica } from '../models/estadistica.model';

@Injectable({
  providedIn: 'root',
})
export class EstadisticaService {

  private apiUrl = 'http://localhost:8080/estadisticas';

  constructor(private http: HttpClient){}

  getByJugador(idJugador: number): Observable<Estadistica> {
    return this.http.get<Estadistica>(`${this.apiUrl}/jugador/${idJugador}`);
  }

  getByJugadorYTorneo(idJugador: number, idTorneo: number): Observable<Estadistica> {
    return this.http.get<Estadistica>(`${this.apiUrl}/jugador/${idJugador}/torneo/${idTorneo}`);
  }
}
