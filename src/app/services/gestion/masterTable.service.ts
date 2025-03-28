import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, Observable, throwError } from 'rxjs';
import { environment } from 'src/environments/environment.prod';
import { StorageService } from '../storage.service';

@Injectable({
    providedIn: 'root'
})
export class MasterTableService {

    apiUrl = environment.apiUrl

    constructor(private http: HttpClient, private _storageService: StorageService) { }

    private getToken(): string | null {
        return this._storageService.get('manzanares-token')  ;
    }
    
    private getHeaders(isFormData: boolean = false): HttpHeaders {
        const token = this.getToken();
        let headers = new HttpHeaders({
            'Authorization': `Bearer ${token}`
        });
        
        // No incluir Content-Type para FormData (el navegador lo configurará automáticamente con el boundary)
        if (!isFormData) {
            headers = headers.append('Content-Type', 'application/json');
        }
        
        return headers;
    }


    get( endPoint:string): Observable<any> {
        const url = `${this.apiUrl}${endPoint}`; 
        return this.http.get<any>(url, { headers: this.getHeaders() }).pipe(
        catchError((error) => {
            console.error('Error en la autenticacion: ', error)
            return throwError(() => new Error(`Error al traer los datos de ${endPoint}. Intente nuevamente`))
        })
        )
    }

    create(endPoint:string, formulario: FormData): Observable<any> {
        const url = `${this.apiUrl}${endPoint}/create`;
        
        console.log(`Enviando ${formulario} a la API`);
        
        // Log de todas las entradas en el FormData para depuración
        console.log("Contenido del FormData:");
        formulario.forEach((value, key) => {
            console.log(`${key}:`, value);
        });
        
        // No incluir Content-Type en los headers para FormData
        const headers = this.getHeaders(true);
        
        return this.http.post<any>(url, formulario, { 
            headers: headers 
        }).pipe(
            catchError((error) => {
                console.error(`Error al crear ${endPoint} :`, error);
                
                // Imprimir la respuesta del servidor para depuración
                if (error.error) {
                    console.error('Respuesta del servidor:', error.error);
                }
                
                // Devolver el error completo para que el componente pueda manejarlo
                return throwError(() => error);
            })
        );
    }

    update(endPoint:string , formulario: FormData): Observable<any> {
        
        // Obtener el ID del FormData ya que no se puede acceder como propiedad
        const registerId = formulario.get('id');
        console.log(`ID ${endPoint}`, registerId);
        
        
        if (!registerId) {
            console.error(`El objeto ${endPoint} no tiene un ID válido`);
            return throwError(() => new Error(`No se puede actualizar ${endPoint} sin un ID válido`));
        }

        const url = `${this.apiUrl}${endPoint}/${registerId}`;
        
        // Log de todas las entradas en el FormData para depuración
        console.log("Contenido del FormData para actualización:");
        formulario.forEach((value, key) => {
            console.log(`${key}:`, value);
        });
        
        // No incluir Content-Type en los headers para FormData
        const headers = this.getHeaders(true);
        
        return this.http.put<any>(url, formulario, { 
            headers: headers 
        }).pipe(
            catchError((error) => {
                console.error(`Error al editar ${endPoint}`, error);
                return throwError(() => new Error('Error al editar ${Table}: ' + (error.message || 'Error desconocido')));
            })
        );
    }

    delete(endPoint:string, id: number): Observable<any> {
        if (!id) {
            console.error('El ID no es válido para eliminar');
            return throwError(() => new Error('No se puede eliminar sin un ID válido'));
        }

        const url = `${this.apiUrl}${endPoint}/delete/${id}`;
        return this.http.delete<any>(url, { headers: this.getHeaders() }).pipe(
            catchError((error) => {
                console.error(`Error al eliminar ${endPoint}`, error);
                return throwError(() => new Error(`Error al eliminar ${endPoint}`));
            })
        );
    }

    }
