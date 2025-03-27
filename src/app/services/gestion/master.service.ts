import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, Observable, throwError } from 'rxjs';
import { environment } from 'src/environments/environment.prod';
import { StorageService } from '../storage.service';

@Injectable({
  providedIn: 'root'
})
export class MasterService {

  apiUrl = environment.apiUrl

  constructor(private http: HttpClient, private storageService: StorageService) { }

  private getToken(): string | null {
    return this.storageService.get('manzanares-token');

  }

  private getHeaders(): HttpHeaders {
    const token = this.getToken();
    return new HttpHeaders({
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json'
    });
  }

  get(endpoint: string): Observable<any> {
    const url = `${this.apiUrl}${endpoint}`
    const token = this.storageService.get('manzanares-token')

    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    });

    return this.http.get<any>(url, { headers }).pipe(
      catchError((error) => {
        console.error('Error en la autenticacion: ', error)
        return throwError(() => new Error('Error al traer los datos. Intente nuevamente'))
      })
    )
  }

  getId (endpoint: string, id: number) {
    const url = `${this.apiUrl}${endpoint}/${id}`
    const token = this.storageService.get('manzanares-token')

    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    });

    return this.http.get<any>(url, { headers }).pipe(
      catchError((error) => {
        console.error('Error en la autenticacion: ', error)
        return throwError(() => new Error('Error al traer los datos. Intente nuevamente'))
      })
    )
  }

  create(masterTable: string, reg: any): Observable<any> {
    const url = `${this.apiUrl}${masterTable}/create`;
    return this.http.post<any>(url, reg, { headers: this.getHeaders() }).pipe(
      catchError((error) => {
        console.error(`Error al crear   ${masterTable} :`, error);
        return throwError(() => new Error(`Error al crear  ${masterTable}`));
      })
    );
  }

  createtow(masterTable: string, reg: any): Observable<any> {
    const url = `${this.apiUrl}${masterTable}/bulk-upsert`;
    return this.http.post<any>(url, reg, { headers: this.getHeaders() }).pipe(
      catchError((error) => {
        console.error(`Error al crear   ${masterTable} :`, error);
        return throwError(() => new Error(`Error al crear  ${masterTable}`));
      })
    );
  }

  update(data: any, endpoint: string, id: number): Observable<any> {
    const url = `${this.apiUrl}${endpoint}/${id}`
    const token = this.storageService.get('manzanares-token')

    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    });

    return this.http.put<any>(url, data, { headers }).pipe(
      catchError((error) => {
        console.error('Error al editar al usuario', error)
        return throwError(() => new Error('Error al editar la categoria'))
      })
    )
  }

  delete(masterTable: string, id: number): Observable<any> {
    if (!id) {
      console.error(`El ID no es válido para eliminar ${masterTable}`);
      return throwError(() => new Error('No se puede eliminar ${masterTable} sin un ID válido'));
    }

    const url = `${this.apiUrl}${masterTable}/delete/${id}`;


    return this.http.delete<any>(url, { headers: this.getHeaders() }).pipe(
      catchError((error) => {
        console.error(`Error al eliminar ${masterTable}`, error);
        return throwError(() => new Error(`Error al eliminar ${masterTable}`));
      })
    );
  }


}



/**  ionic g service services/manzanares/master */