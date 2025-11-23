import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Equipo } from '../models/equipo.model';

@Injectable({
  providedIn: 'root',
})
export class EquipoService {
  
  private apiUrl = "http://localhost:8080/equipos";

  constructor(private http: HttpClient){}

  // 1. LISTAR TODOS (GET /equipos)
  getAll(): Observable<any[]>{
    return this.http.get<Equipo[]>(this.apiUrl);
  }

  // 2. BUSCAR POR ID (GET /equipos/{id})
  getById(id: number): Observable<any>{
    return this.http.get<any>(`${this.apiUrl}/${id}`);
  }

  // 3. CREAR (POST /equipos)
  create(equipo: any): Observable<any> {
    return this.http.post<any>(this.apiUrl, equipo);
  }

  // 4. ACTUALIZAR (PUT /equipos/{id})
  update(id: number, data: any): Observable<any>{
    return this.http.put<any>(`${this.apiUrl}/${id}`, data);
  }

  // 5. ELIMINAR (DELETE /equipos/{id})
  delete(id:number): Observable<any>{
    return this.http.delete<any>(`${this.apiUrl}/${id}`)
  }
}
