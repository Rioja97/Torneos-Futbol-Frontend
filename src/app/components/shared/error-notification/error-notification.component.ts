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
      <div *ngIf="currentError.details" class="alert-details-actions">
        <button class="details-toggle" (click)="toggleDetails()">{{ showDetails ? 'Ocultar detalles' : 'Ver detalles' }}</button>
      </div>
      <small *ngIf="showDetails && currentError.details" class="alert-details">
        {{ currentError.details }}
      </small>
    </div>
  `,
  styles: [`
    .alert {
      position: fixed;
      top: 16px;
      right: 16px;
      max-width: 420px;
      padding: 12px 14px;
      border-radius: 8px;
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.12);
      animation: slideIn 0.25s ease-out;
      z-index: 9999;
      font-size: 0.95rem;
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
      font-weight: 600;
      font-size: 0.95rem;
      line-height: 1.2;
      max-height: 3.6rem;
      overflow: hidden;
      text-overflow: ellipsis;
    }

    .alert-details-actions {
      display: flex;
      justify-content: flex-end;
      margin-top: 6px;
    }

    .details-toggle {
      background: transparent;
      border: none;
      color: inherit;
      text-decoration: underline;
      cursor: pointer;
      font-size: 0.85rem;
      opacity: 0.9;
      padding: 0;
    }

    .alert-details {
      display: block;
      margin-top: 8px;
      opacity: 0.85;
      font-family: monospace;
      max-height: 10rem;
      overflow: auto;
      padding: 8px;
      background: rgba(255,255,255,0.04);
      border-radius: 6px;
      font-size: 0.85rem;
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
  public showDetails = false;

  constructor(private errorHandler: ErrorHandlerService) {}

  ngOnInit(): void {
    this.errorHandler.error$
      .pipe(takeUntil(this.destroy$))
      .subscribe((error: ErrorMessage | null) => {
        this.currentError = error;
        
        // Auto-cerrar TODOS los mensajes después de 5 segundos
        if (error) {
          this.autoCloseTimer = setTimeout(() => this.cerrar(), 5000);
          // reset details view when a new error arrives
          this.showDetails = false;
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

  toggleDetails(): void {
    this.showDetails = !this.showDetails;
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
