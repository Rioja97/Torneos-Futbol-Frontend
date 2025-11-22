import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Equipo } from '../components/equipos/equipos';

@Injectable({
  providedIn: 'root',
})
export class EquipoService {
  
  private apiUrl = "https://localhost:8080/equipos";

  constructor(private http: HttpClient){}

  // 1. LISTAR TODOS (GET /equipos)
  getAll(): Observable<Equipo[]>{
    return this.http.get<Equipo[]>(this.apiUrl);
  }

  // 2. BUSCAR POR ID (GET /equipos/{id})
  getById(id: number): Observable<Equipo>{
    return this.http.get<Equipo>(`${this.apiUrl}/${id}`);
  }

  // 3. CREAR (POST /equipos)
  create(equipo: Equipo): Observable<Equipo> {
    return this.http.post<Equipo>(this.apiUrl, equipo);
  }

  update(id: number): Observable<Equipo>{
    return this.http.put<Equipo>(`${this.apiUrl}/${id}`, id);
  }
}
