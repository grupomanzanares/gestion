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
    window.addEventListener('beforeunload', this.handleBeforeUnload)
  }

  ngOnDestroy() {
    sessionStorage.removeItem('active');
    clearTimeout(this.inactivityTimeout);

    window.removeEventListener('mousemove', this.boundMousemove);
    window.removeEventListener('keydown', this.boundKeydown);
    window.removeEventListener('click', this.boundClick);
    window.removeEventListener('touchstart', this.boundTouchstart);
    window.removeEventListener('beforeunload', this.handleBeforeUnload)
  }

  private resetInactivityTimer() {
    clearTimeout(this.inactivityTimeout);
    this.inactivityTimeout = setTimeout(() => {
      console.log("Tiempo de inactividad excedido. Cerrando sesión...");
      this.authService.logout();
    }, this.TIME_LIMIT);
  }

  // Esta función se ejecuta cuando el usuario intenta cerrar la pestaña, recargar o navegar fuera
  private handleBeforeUnload = (event: BeforeUnloadEvent) => {
    // Obtenemos las entradas de navegación registradas por el navegador
    const navEntries = performance.getEntriesByType("navigation") as PerformanceNavigationTiming[];

    // Identificamos el tipo de navegación: puede ser 'reload', 'navigate', 'back_forward', etc.
    // Si no se encuentra, se asume 'navigate' por defecto
    const navType = navEntries[0]?.type || 'navigate';

    // Si la navegación NO es una recarga ('reload') y la sesión está activa,
    // entonces ejecutamos el cierre de sesión
    if (navType !== 'reload' && sessionStorage.getItem('active') === 'true') {
      this.authService.logout(); // Cierra la sesión del usuario
    }
  };


}
