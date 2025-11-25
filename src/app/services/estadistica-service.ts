import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { Estadistica } from '../models/estadistica.model';

@Injectable({
  providedIn: 'root',
})
export class EstadisticaService {

  private apiUrl = 'http://localhost:8080/estadisticas';

  constructor(private http: HttpClient){}

  // ✅ ESTADÍSTICAS POR JUGADOR
  getByJugador(idJugador: number): Observable<Estadistica> {
    return this.http.get<Estadistica>(`${this.apiUrl}/jugador/${idJugador}`);
  }

  // ✅ ESTADÍSTICAS POR JUGADOR Y TORNEO
  getByJugadorYTorneo(idJugador: number, idTorneo: number): Observable<Estadistica> {
    return this.http.get<Estadistica>(
      `${this.apiUrl}/jugador/${idJugador}/torneo/${idTorneo}`
    );
  }

  // ✅ ESTADÍSTICAS POR TORNEO
  getByTorneo(idTorneo: number): Observable<Estadistica[]> {
    const url = `${this.apiUrl}/torneo/${idTorneo}`;
    console.log('🔍 Llamando a URL:', url);
    return this.http.get<Estadistica[]>(url).pipe(
      map(stats => {
        console.log('✅ Stats recibidas del backend:', stats);
        console.log('📊 Cantidad de estadísticas:', stats.length);
        return stats;
      }),
      catchError((err) => {
        console.error('❌ Error cargando estadísticas:', err);
        console.error('❌ URL que falló:', url);
        console.error('❌ Status:', err.status);
        return of([]);
      })
    );
  }
}

