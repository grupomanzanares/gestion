import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Router, RouterLink } from '@angular/router';
import { catchError, Observable, throwError } from 'rxjs';
import { environment } from 'src/environments/environment.prod';
import { StorageService } from './storage.service';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  apiUrl = environment.apiUrl

  constructor(private http: HttpClient, 
    private router: Router,
    private storageService: StorageService) { }

  /** Logearse */  
  login(identificacion: number, password: string): Observable<any> {
    const url = `${this.apiUrl}auth/login`; // Construir la URL completa
    const body = { identificacion, password };
    return this.http.post<any>(url, body).pipe(
      catchError((error) => {
        console.error('Error en la autenticación:', error);
        return throwError(() => new Error('Error en el login. Intente nuevamente.'));
      })
    );
  }

  /** Registrarse */
  register(userData: any): Observable<any> {
    const url = `${this.apiUrl}auth/register`;
    const headers = { 'Content-Type': 'application/json' };
    return this.http.post<any>(url, userData, { headers }).pipe(
      catchError((error) => {
        console.error('Error en el registro:', error);
        return throwError(() => new Error('Error en el registro.'));
      })
    );
  }

  /** Cerrar Sesion */
  logout(): void {
    localStorage.removeItem('manzanares-token')
    localStorage.removeItem('manzanares-user')
    // localStorage.removeItem('manzanares-rol')
    setTimeout(() => {
      // window.location.href = '/auth'; 
      this.router.navigateByUrl('/auth')
    }, 100);
  }

  /**Conocer Estado de Autenticacion */
  isAuthenticated(): boolean {
    /** Obtiene el valor almacenado en el localStorage con la clave 'token': Si el token existe, devuelve una cadena con su valor sino devuelve null  */
    return !!localStorage.getItem('manzanares-token');
  }



  // saveToken(token: string, userName: string): void {
  //   localStorage.setItem('token', token);
  //   localStorage.setItem('userName', userName)
  // }

  /** Ver para que es esto */

  getLoggedUserName(): string {
    return localStorage.getItem('userName') || 'Usuario';
  }



  /** Enviar solicitud de recuperación de contraseña */
  forgotPassword(identificacion: number, email: string): Observable<any> {
    const url = `${this.apiUrl}auth/forgot-password`;
    const body = { identificacion, email };
    return this.http.post<any>(url, body).pipe(
      catchError((error) => {
        console.error('Error en la recuperación de contraseña:', error);
        return throwError(() => new Error('Error al solicitar la recuperación de contraseña. Intente nuevamente.'));
      })
    );
  }

/**  Resetear Password cuando el usuario da click al correo enviado para recuperacion de contraseña */
  resetPassword(token: string, password: string): Observable<any> {
    const url = `${this.apiUrl}auth/reset-password`;
    const body = { token, password };
    return this.http.post<any>(url, body).pipe(
      catchError((error) => {
        console.error('Error en el restablecimiento de contraseña:', error);
        return throwError(() => new Error('Error al restablecer la contraseña. Intente nuevamente.'));
      })
    );
  }

 /** Validar si el token enviado al correo aun es valido para recuperacion de contraseña */
  validateToken(token: string): Observable<any> {
    const url = `${this.apiUrl}auth/forgot-password/${token}`;
    return this.http.get<any>(url).pipe(
      catchError((error) => {
        console.error('Error validando el token:', error);
        return throwError(() => new Error('El token de recuperación no es válido o ha expirado.'));
      })
    );
  }
}


