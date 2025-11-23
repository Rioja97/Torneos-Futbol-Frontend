import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Jugador } from '../models/jugador.model';

@Injectable({
  providedIn: 'root'
})
export class JugadorService {
  private apiUrl = 'http://localhost:8080/jugadores';

  constructor(private http: HttpClient) { }

  getAll(): Observable<Jugador[]> {
    return this.http.get<Jugador[]>(this.apiUrl);
  }

  getById(id: number): Observable<Jugador> {
    return this.http.get<Jugador>(`${this.apiUrl}/${id}`);
  }

  create(jugador: any): Observable<any> {
    return this.http.post(this.apiUrl, jugador);
  }

  update(id: number, jugador: any): Observable<any> {
    return this.http.put(`${this.apiUrl}/${id}`, jugador);
  }

  delete(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}`);
  }
}