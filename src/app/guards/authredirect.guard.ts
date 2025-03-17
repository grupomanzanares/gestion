import { Injectable, inject } from '@angular/core';
import { CanActivate } from '@angular/router';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

/**Esto asegura que el guard esté disponible en toda la aplicación */
@Injectable({
  providedIn: 'root'
})

export class AuthRedirectGuard implements CanActivate{
  
  constructor(private _authService: AuthService , private _router: Router) {}

  canActivate(): boolean {
    if (this._authService.isAuthenticated()) {
      // Si el usuario está autenticado, redirige a 'home'
      this._router.navigateByUrl('/main');
      return false; // Esta en el proceso de autenticacion y  esta autenticado entonces lo envia a Home, para que no tenga que autenticarse
    }
    return true; //  Esta en el proceso de autenticacion y no esta autenticado entonces lo envia a autenticarse
  }


}



/**  Su objetivo evitar estar autenticandose si ya se encuentra autenticado */