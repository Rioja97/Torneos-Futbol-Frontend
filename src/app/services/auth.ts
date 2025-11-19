import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { LoginRequestDTO } from '../models/login-request.dto';
import { AuthResponseDTO } from '../models/auth-response.dto';
import { RegisterRequestDTO } from '../models/register-request.dto';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class Auth {
  private apiUrl = "http://localhost:8080/auth";

  constructor (private http: HttpClient){}

  login(credentials: LoginRequestDTO): Observable<AuthResponseDTO>{
    return this.http.post<AuthResponseDTO>(`${this.apiUrl}/login`, credentials);
  }

  register(credentials: RegisterRequestDTO): Observable<AuthResponseDTO>{
    return this.http.post<AuthResponseDTO>(`${this.apiUrl}/register`, credentials);
  }
}
