import { Component, HostListener, OnDestroy, OnInit } from '@angular/core';
import { AuthService } from './services/auth.service';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
  standalone: false,
})
export class AppComponent implements OnInit, OnDestroy {

  private inactivityTimeout: any;
  private readonly TIME_LIMIT = 60 * 60 * 1000;

  constructor(private authService: AuthService) { }

  ngOnInit() {
    sessionStorage.setItem('active', 'true');
    this.resetInactivityTimer();

    // Detecta eventos de interacción y reinicia el temporizador
    window.addEventListener('mousemove', this.resetInactivityTimer.bind(this));
    window.addEventListener('keydown', this.resetInactivityTimer.bind(this));
    window.addEventListener('click', this.resetInactivityTimer.bind(this));
    window.addEventListener('touchstart', this.resetInactivityTimer.bind(this));
  }

  ngOnDestroy() {
    sessionStorage.removeItem('active');
    clearTimeout(this.inactivityTimeout);

    // Limpia los listeners
    window.removeEventListener('mousemove', this.resetInactivityTimer.bind(this));
    window.removeEventListener('keydown', this.resetInactivityTimer.bind(this));
    window.removeEventListener('click', this.resetInactivityTimer.bind(this));
    window.removeEventListener('touchstart', this.resetInactivityTimer.bind(this));
  }

  private resetInactivityTimer() {
    clearTimeout(this.inactivityTimeout);
    this.inactivityTimeout = setTimeout(() => {
      console.log("Tiempo de inactividad excedido. Cerrando sesión...");
      this.authService.logout();
    }, this.TIME_LIMIT);
  }

}
