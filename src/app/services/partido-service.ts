import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Partido } from '../models/partido.model';
@Injectable({
  providedIn: 'root',
})
export class PartidoService {

  private apiUrl = 'http://localhost:8080/partidos';

  constructor(private http: HttpClient){}

  getById(id: number): Observable<Partido> {
    return this.http.get<Partido>(`${this.apiUrl}/${id}`);
  }

  update(id: number, partido: Partial<Partido>): Observable<Partido> {
    return this.http.put<Partido>(`${this.apiUrl}/${id}`, partido);
  }
  create(partido: Partido): Observable<Partido> {
  return this.http.post<Partido>(this.apiUrl, partido);
}


  registrarResultado(id: number, data: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/${id}/resultado`, data);
  }
  getAll(): Observable<Partido[]> {
  return this.http.get<Partido[]>(this.apiUrl);
}
delete(id: number): Observable<void> {
  return this.http.delete<void>(`${this.apiUrl}/${id}`);
}


}
