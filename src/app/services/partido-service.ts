import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
// Si tenés la interfaz definida, importala. Si no, usá 'any' por ahora.
// import { Partido } from '../models/partido.model';

@Injectable({
  providedIn: 'root'
})
export class PartidoService {

  private baseUrl = 'http://localhost:8080';
  
  // Rutas base específicas
  private apiUrlPartidos = `${this.baseUrl}/partidos`;
  private apiUrlTorneos  = `${this.baseUrl}/torneos`;

  constructor(private http: HttpClient) { }

  getPartidosPorTorneo(idTorneo: number): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrlTorneos}/${idTorneo}/partidos`);
  }

  registrarResultado(idPartido: number, resultadoDTO: any): Observable<any> {
    return this.http.put(`${this.apiUrlPartidos}/${idPartido}/resultado`, resultadoDTO);
  }
  
  //Crea un partido asignado a un torneo específico.
  crearPartidoEnTorneo(idTorneo: number, partidoDTO: any): Observable<any> {
    return this.http.post(`${this.apiUrlTorneos}/${idTorneo}/partidos`, partidoDTO);
  }

  //Elimina un partido de un torneo.
  eliminarPartidoDeTorneo(idTorneo: number, idPartido: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrlTorneos}/${idTorneo}/partidos/${idPartido}`);
  }

  getAll(): Observable<any[]> {
  return this.http.get<any[]>(this.apiUrlPartidos);
}

   //Busca un partido por su ID único (útil para editar).
  getById(id: number): Observable<any> {
    return this.http.get<any>(`${this.apiUrlPartidos}/${id}`);
  }

  //Actualiza datos generales del partido (fecha, equipos).
  update(id: number, partidoDTO: any): Observable<any> {
    return this.http.patch(`${this.apiUrlPartidos}/${id}`, partidoDTO);
  }

}