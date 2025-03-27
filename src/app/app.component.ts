import { Component, HostListener } from '@angular/core';
import { AuthService } from './services/auth.service';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
  standalone: false,
})
export class AppComponent {
  constructor(private authService: AuthService) { }

  ngOnInit() {
    sessionStorage.setItem('active', 'true'); // Marca la página como activa
  }

  ngOnDestroy() {
    sessionStorage.removeItem('active'); // Limpia el indicador al destruir el componente
  }

  // Detectar cuando se cierra o recarga la pestaña
  // @HostListener('window:beforeunload', ['$event'])
  // clearTokenOnUnload(event: Event) {
  //   console.log("Cerrando pestaña: Eliminando sesión");
  //   this.authService.logout();
  // }

}
