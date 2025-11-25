import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { LoginRequestDTO } from '../models/login-request.dto';
import { AuthResponseDTO } from '../models/auth-response.dto';
import { RegisterRequestDTO } from '../models/register-request.dto';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private apiUrl = "http://localhost:8080/auth";

  constructor (private http: HttpClient){}

  login(credentials: LoginRequestDTO): Observable<AuthResponseDTO>{
    return this.http.post<AuthResponseDTO>(`${this.apiUrl}/login`, credentials);
  }

  register(credentials: RegisterRequestDTO): Observable<AuthResponseDTO>{
    return this.http.post<AuthResponseDTO>(`${this.apiUrl}/register`, credentials);
  }

  // Decodificar JWT y extraer el rol
  getRoleFromToken(): string | null {
    const token = localStorage.getItem('authToken');
    if (!token) return null;

    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      
      // Si authorities es un array, buscar ROLE_ADMIN
      if (Array.isArray(payload.authorities)) {
        const adminAuth = payload.authorities.find((auth: any) => 
          auth === 'ROLE_ADMIN' || 
          auth.authority === 'ROLE_ADMIN' ||
          auth === 'ADMIN' ||
          auth.authority === 'ADMIN'
        );
        if (adminAuth) {
          return typeof adminAuth === 'string' ? adminAuth : adminAuth.authority;
        }
        // Si no encuentra ROLE_ADMIN, retornar el primer authority
        const firstAuth = payload.authorities[0];
        return typeof firstAuth === 'string' ? firstAuth : firstAuth?.authority || null;
      }
      
      // Buscar el rol en diferentes posibles ubicaciones
      return payload.role || payload.authority || null;
    } catch (error) {
      console.error('Error decodificando token:', error);
      return null;
    }
  }

  // Verificar si el usuario es admin
  isAdmin(): boolean {
    const token = localStorage.getItem('authToken');
    if (!token) return false;

    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      
      // Buscar ROLE_ADMIN en el array de authorities
      if (Array.isArray(payload.authorities)) {
        return payload.authorities.some((auth: any) => 
          auth === 'ROLE_ADMIN' || 
          auth.authority === 'ROLE_ADMIN' ||
          auth === 'ADMIN' ||
          auth.authority === 'ADMIN'
        );
      }
      
      // Fallback para otros formatos
      const role = payload.role || payload.authority;
      return role === 'ROLE_ADMIN' || role === 'ADMIN';
    } catch (error) {
      console.error('Error verificando rol admin:', error);
      return false;
    }
  }

  // Verificar si el usuario es espectador
  isEspectador(): boolean {
    const token = localStorage.getItem('authToken');
    if (!token) return false;

    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      
      // Buscar ROLE_ESPECTADOR en el array de authorities
      if (Array.isArray(payload.authorities)) {
        return payload.authorities.some((auth: any) => 
          auth === 'ROLE_ESPECTADOR' || 
          auth.authority === 'ROLE_ESPECTADOR' ||
          auth === 'ESPECTADOR' ||
          auth.authority === 'ESPECTADOR'
        );
      }
      
      // Fallback para otros formatos
      const role = payload.role || payload.authority;
      return role === 'ROLE_ESPECTADOR' || role === 'ESPECTADOR';
    } catch (error) {
      console.error('Error verificando rol espectador:', error);
      return false;
    }
  }
}

