import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ErrorHandlerService, ErrorMessage } from '../../../services/error-handler.service';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

@Component({
  selector: 'app-error-notification',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div *ngIf="currentError" [ngClass]="'alert alert-' + currentError.severity" role="alert">
      <div class="alert-header">
        <span class="alert-icon" [ngSwitch]="currentError.severity">
          <span *ngSwitchCase="'error'">❌</span>
          <span *ngSwitchCase="'warning'">⚠️</span>
          <span *ngSwitchCase="'info'">ℹ️</span>
        </span>
        <strong>{{ getTitle() }}</strong>
        <button type="button" class="btn-close" (click)="cerrar()"></button>
      </div>
      <p class="alert-message">{{ currentError.message }}</p>
      <small *ngIf="currentError.details" class="alert-details">
        {{ currentError.details }}
      </small>
    </div>
  `,
  styles: [`
    .alert {
      position: fixed;
      top: 20px;
      right: 20px;
      max-width: 500px;
      padding: 16px;
      border-radius: 8px;
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
      animation: slideIn 0.3s ease-out;
      z-index: 9999;
    }

    @keyframes slideIn {
      from {
        transform: translateX(400px);
        opacity: 0;
      }
      to {
        transform: translateX(0);
        opacity: 1;
      }
    }

    .alert-error {
      background-color: #f8d7da;
      border: 1px solid #f5c6cb;
      color: #721c24;
    }

    .alert-warning {
      background-color: #fff3cd;
      border: 1px solid #ffeaa7;
      color: #856404;
    }

    .alert-info {
      background-color: #d1ecf1;
      border: 1px solid #bee5eb;
      color: #0c5460;
    }

    .alert-header {
      display: flex;
      align-items: center;
      gap: 10px;
      margin-bottom: 8px;
    }

    .alert-icon {
      font-size: 1.2rem;
    }

    .alert-message {
      margin: 0;
      font-weight: 500;
    }

    .alert-details {
      display: block;
      margin-top: 8px;
      opacity: 0.8;
      font-family: monospace;
      overflow-wrap: break-word;
    }

    .btn-close {
      background: none;
      border: none;
      font-size: 1.2rem;
      cursor: pointer;
      color: inherit;
      opacity: 0.7;
      transition: opacity 0.2s;
      margin-left: auto;
    }

    .btn-close:hover {
      opacity: 1;
    }
  `]
})
export class ErrorNotificationComponent implements OnInit, OnDestroy {
  currentError: ErrorMessage | null = null;
  private destroy$ = new Subject<void>();
  private autoCloseTimer: any;

  constructor(private errorHandler: ErrorHandlerService) {}

  ngOnInit(): void {
    this.errorHandler.error$
      .pipe(takeUntil(this.destroy$))
      .subscribe((error: ErrorMessage | null) => {
        this.currentError = error;
        
        // Auto-cerrar TODOS los mensajes después de 5 segundos
        if (error) {
          this.autoCloseTimer = setTimeout(() => this.cerrar(), 5000);
        }
      });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
    if (this.autoCloseTimer) {
      clearTimeout(this.autoCloseTimer);
    }
  }

  cerrar(): void {
    this.errorHandler.clearError();
  }

  getTitle(): string {
    switch (this.currentError?.severity) {
      case 'error': return 'Error';
      case 'warning': return 'Advertencia';
      case 'info': return 'Información';
      default: return 'Notificación';
    }
  }
}
