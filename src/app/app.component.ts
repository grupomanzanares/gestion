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
  private readonly TIME_LIMIT = 10 * 60 * 1000;

  // Guardar las funciones enlazadas
  private boundMousemove = this.resetInactivityTimer.bind(this);
  private boundKeydown = this.resetInactivityTimer.bind(this);
  private boundClick = this.resetInactivityTimer.bind(this);
  private boundTouchstart = this.resetInactivityTimer.bind(this);

  constructor(private authService: AuthService) { }

  ngOnInit() {
    sessionStorage.setItem('active', 'true');
    this.resetInactivityTimer();

    window.addEventListener('mousemove', this.boundMousemove);
    window.addEventListener('keydown', this.boundKeydown);
    window.addEventListener('click', this.boundClick);
    window.addEventListener('touchstart', this.boundTouchstart);
  }

  ngOnDestroy() {
    sessionStorage.removeItem('active');
    clearTimeout(this.inactivityTimeout);

    window.removeEventListener('mousemove', this.boundMousemove);
    window.removeEventListener('keydown', this.boundKeydown);
    window.removeEventListener('click', this.boundClick);
    window.removeEventListener('touchstart', this.boundTouchstart);
  }

  private resetInactivityTimer() {
    clearTimeout(this.inactivityTimeout);
    this.inactivityTimeout = setTimeout(() => {
      console.log("Tiempo de inactividad excedido. Cerrando sesión...");
      this.authService.logout();
    }, this.TIME_LIMIT);
  }
}
