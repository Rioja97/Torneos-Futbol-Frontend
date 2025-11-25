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

        // Detalles adicionales (no mostramos siempre la traza completa para evitar mensajes gigantes)
        errorMessage.details = error.error?.details || error.error?.trace;

        // Si parece ser un error de validación (mensaje largo con 'Field error' o 'default message')
        // parseamos los mensajes y los colocamos en message de forma compacta.
        if (error.status === 400) {
          const raw = error.error?.message || error.error || '';
          if (typeof raw === 'string') {
            // Buscar patrones como: default message [...]
            const re = /default message \[(.*?)\]/g;
            const matches: string[] = [];
            let m;
            // eslint-disable-next-line no-cond-assign
            while ((m = re.exec(raw)) !== null) {
              if (m[1]) matches.push(m[1].trim());
            }

            // Si hay matches, construimos un mensaje compacto y borramos details
            if (matches.length > 0) {
              // eliminar duplicados y limitar a 5 mensajes para no sobrecargar
              const unique = Array.from(new Set(matches)).slice(0, 5);
              errorMessage.message = unique.join(' · ');
              errorMessage.details = undefined; // evitar mostrar el cuerpo largo debajo
            }
          }

          // Si el backend devuelve un objeto con fieldErrors o errors, extraemos los mensajes
          if (Array.isArray(error.error?.fieldErrors) || Array.isArray(error.error?.errors)) {
            const arr = error.error.fieldErrors || error.error.errors;
            try {
              const msgs = arr.map((f: any) => f.defaultMessage || f.message || `${f.field}: ${f.defaultMessage || f.message}`)
                              .filter(Boolean);
              if (msgs.length) {
                const unique = Array.from(new Set(msgs)).slice(0, 6);
                errorMessage.message = unique.join(' · ');
                errorMessage.details = undefined;
              }
            } catch (e) {
              // ignore parsing errors
            }
          }
        }

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
   * Formatea un objeto de error (por ejemplo HttpErrorResponse) y devuelve un mensaje compacto
   * ideal para mostrarse inline en formularios.
   */
  public formatErrorMessage(error: any): string {
    if (!error) return 'Ocurrió un error inesperado.';

    // Si nos pasan HttpErrorResponse, intentamos extraer mensajes útiles
    if (error instanceof HttpErrorResponse) {
      // Priorizar mensajes controlados por el backend
      if (error.error?.message && typeof error.error.message === 'string') {
        const raw = error.error.message;
        // Extraer mensajes dentro de `default message [...]`
        const re = /default message \[(.*?)\]/g;
        const matches: string[] = [];
        let m;
        // eslint-disable-next-line no-cond-assign
        while ((m = re.exec(raw)) !== null) {
          if (m[1]) matches.push(m[1].trim());
        }
        if (matches.length > 0) {
          return Array.from(new Set(matches)).slice(0, 6).join(' · ');
        }

        // Si no hay matches, reducir el raw: tomar la primera frase significativa
        const oneLine = raw.replace(/\s+/g, ' ');
        const parts = oneLine.split(/(?<=\.)\s+/); // split by sentence
        return parts[0].length > 0 ? parts[0] : raw;
      }

      // Si viene en fieldErrors / errors
      if (Array.isArray(error.error?.fieldErrors) || Array.isArray(error.error?.errors)) {
        const arr = error.error.fieldErrors || error.error.errors;
        try {
          const messages = arr.map((f: any) => f.defaultMessage || f.message || `${f.field}: ${f.defaultMessage || f.message}`)
                               .filter(Boolean);
          if (messages.length) {
            return Array.from(new Set(messages)).slice(0, 6).join(' · ');
          }
        } catch (e) {
          // fallthrough
        }
      }

      // Fallbacks por status
      if (error.status === 0) return 'No se pudo conectar con el servidor.';
      if (error.status === 401) return 'Sesión expirada. Por favor inicia sesión nuevamente.';
      if (error.status === 403) return 'No tienes permisos para realizar esta acción.';
      if (error.status === 404) return 'Recurso no encontrado.';

      // Si llega un error estructura simple
      if (error.error && typeof error.error === 'string') {
        // acortar largas cadenas
        const small = error.error.replace(/\s+/g, ' ');
        return small.split('.').slice(0,1).join('.');
      }
    }

    // Otros errores genéricos
    if (error?.message) return error.message;
    return 'Ocurrió un error inesperado.';
  }

  /**
   * Extrae la lista de errores amigables desde la respuesta del backend.
   * Prioriza `error.error.errores` si está presente, luego `fieldErrors`/`errors`,
   * luego intenta parsear 'default message [...]' y finalmente devuelve el mensaje compacto.
   */
  public formatErrorList(error: any): string[] {
    if (!error) return ['Ocurrió un error inesperado.'];

    // Si el backend nos devuelve exactamente la estructura {error: ..., errores: [...]}
    if (Array.isArray(error?.error?.errores)) {
      return error.error.errores.map((s: any) => String(s)).filter(Boolean);
    }

    if (Array.isArray(error.error?.fieldErrors) || Array.isArray(error.error?.errors)) {
      const arr = error.error.fieldErrors || error.error.errors;
      try {
        const msgs = arr.map((f: any) => f.defaultMessage || f.message || `${f.field}: ${f.defaultMessage || f.message}`)
                        .filter(Boolean);
        if (msgs.length) return Array.from(new Set(msgs));
      } catch (e) {
        // ignore
      }
    }

    // Buscar patrones como default message [...] en un string
    const raw = error.error?.message || error.error || '';
    if (typeof raw === 'string') {
      const re = /default message \[(.*?)\]/g;
      const matches: string[] = [];
      let m;
      // eslint-disable-next-line no-cond-assign
      while ((m = re.exec(raw)) !== null) {
        if (m[1]) matches.push(m[1].trim());
      }
      if (matches.length) return Array.from(new Set(matches));

      // Si es string y contiene varios errores separados por salto de linea, split
      if (raw.includes('\n')) {
        return raw.split('\n').map((s: string) => s.trim()).filter(Boolean);
      }
    }

    // Fallback: devolver el mensaje compacto como único elemento
    const single = this.formatErrorMessage(error);
    return [single];
  }

  /**
   * Muestra un mensaje de error
   */
  showError(message: string | ErrorMessage): void {
    const toShow: ErrorMessage = typeof message === 'string'
      ? { message, severity: 'error', timestamp: new Date() }
      : message;

    // Evitar mostrar mensajes idénticos repetidos (posibles llamadas duplicadas)
    const current = this.errorSubject.value;
    if (current && current.message === toShow.message && current.severity === toShow.severity) {
      // No re-emite el mismo mensaje
      return;
    }

    this.errorSubject.next(toShow);
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
