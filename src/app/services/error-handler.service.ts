import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { HttpErrorResponse } from '@angular/common/http';

export interface ErrorMessage {
  message: string;
  severity: 'error' | 'warning' | 'info';
  timestamp: Date;
  details?: string;
}

@Injectable({
  providedIn: 'root'
})
export class ErrorHandlerService {
  private errorSubject = new BehaviorSubject<ErrorMessage | null>(null);
  public error$: Observable<ErrorMessage | null> = this.errorSubject.asObservable();

  constructor() {}

  /**
   * Maneja errores HTTP y extrae el mensaje del backend
   */
  handleError(error: any): ErrorMessage {
    let errorMessage: ErrorMessage = {
      message: 'Ocurrió un error inesperado',
      severity: 'error',
      timestamp: new Date(),
      details: undefined
    };

    if (error instanceof HttpErrorResponse) {
      // Error de respuesta HTTP
      if (error.error instanceof ErrorEvent) {
        // Error del cliente
        errorMessage.message = error.error.message || 'Error en la solicitud';
        errorMessage.details = error.error.error?.toString();
      } else {
        // Error del servidor
        if (error.error?.message) {
          errorMessage.message = error.error.message;
        } else if (error.error?.error) {
          errorMessage.message = error.error.error;
        } else if (error.error?.detail) {
          errorMessage.message = error.error.detail;
        } else if (error.statusText) {
          errorMessage.message = error.statusText;
        }

        // Detalles adicionales
        errorMessage.details = error.error?.details || error.error?.trace;

        // Ajustar severidad según el código
        if (error.status === 404) {
          errorMessage.message = `No encontrado: ${errorMessage.message}`;
        } else if (error.status === 400) {
          errorMessage.message = `Solicitud inválida: ${errorMessage.message}`;
        } else if (error.status === 401) {
          errorMessage.message = 'Sesión expirada. Por favor, inicia sesión nuevamente.';
          errorMessage.severity = 'warning';
        } else if (error.status === 403) {
          errorMessage.message = 'No tienes permisos para realizar esta acción.';
          errorMessage.severity = 'warning';
        }
      }
    } else if (error?.message) {
      errorMessage.message = error.message;
    }

    // Mostrar el error
    this.showError(errorMessage);
    console.error('Error capturado:', errorMessage);

    return errorMessage;
  }

  /**
   * Muestra un mensaje de error
   */
  showError(message: string | ErrorMessage): void {
    if (typeof message === 'string') {
      const errorMsg: ErrorMessage = {
        message,
        severity: 'error',
        timestamp: new Date()
      };
      this.errorSubject.next(errorMsg);
    } else {
      this.errorSubject.next(message);
    }
  }

  /**
   * Muestra un mensaje de advertencia
   */
  showWarning(message: string): void {
    const warningMsg: ErrorMessage = {
      message,
      severity: 'warning',
      timestamp: new Date()
    };
    this.errorSubject.next(warningMsg);
  }

  /**
   * Muestra un mensaje de información
   */
  showInfo(message: string): void {
    const infoMsg: ErrorMessage = {
      message,
      severity: 'info',
      timestamp: new Date()
    };
    this.errorSubject.next(infoMsg);
  }

  /**
   * Limpia el mensaje de error actual
   */
  clearError(): void {
    this.errorSubject.next(null);
  }

  /**
   * Obtiene el último error
   */
  getLastError(): ErrorMessage | null {
    return this.errorSubject.value;
  }
}
