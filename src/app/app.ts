import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { ErrorNotificationComponent } from './components/shared/error-notification/error-notification.component';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, ErrorNotificationComponent],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  protected readonly title = signal('torneo-futbol-frontend');
}
