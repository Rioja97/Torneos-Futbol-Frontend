import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Entrenador } from '../models/entrenador.model';

@Injectable({
  providedIn: 'root',
})
export class EntrenadorService {

  private apiUrl = 'http://localhost:8080/entrenadores';

  constructor(private http: HttpClient){}

  getAll(): Observable<Entrenador[]> {
    return this.http.get<Entrenador[]>(this.apiUrl);
  }

  getById(id: number): Observable<Entrenador> {
    return this.http.get<Entrenador>(`${this.apiUrl}/${id}`);
  }

  create(entrenador: any): Observable<any> {
    return this.http.post<any>(this.apiUrl, entrenador);
  }

  update(id: number, entrenador: Entrenador): Observable<Entrenador> {
    return this.http.put<Entrenador>(`${this.apiUrl}/${id}`, entrenador);
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}
