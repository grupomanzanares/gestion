import { CanActivate, CanActivateFn, Router } from '@angular/router';
import { Injectable } from '@angular/core';
import { AuthService } from '../services/auth.service';

/**Esto asegura que el guard esté disponible en toda la aplicación */
@Injectable({
  providedIn: 'root',  
})

export class AuthGuard implements CanActivate {

  constructor(private _authService: AuthService, private _router: Router) {}

    canActivate(): boolean {
    if (this._authService.isAuthenticated()) {
      return true;
    } else {
      this._authService.logout()
      // this._router.navigateByUrl('/auth');
      return false;
    }
  }
}

/**  Si esta autenticado devuelve true, sino false y retorna a la pantalla de autenticarse */
/**  Estar autenticado es encontrar un token en localstorage */
/**  Su objetivo es proteger la ruta Home */