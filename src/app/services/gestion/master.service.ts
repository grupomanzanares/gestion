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

  constructor( private http: HttpClient, private _storageService: StorageService ) { }

  private getToken(): string | null {
    return this._storageService.get('manzanares-token')  ;

  }

  private getHeaders(): HttpHeaders {
    const token = this.getToken();
    return new HttpHeaders({
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json'
    });
  }


  get( masterTable:string): Observable<any> {
    const url = `${this.apiUrl}${masterTable}`; 
    return this.http.get<any>(url, { headers: this.getHeaders() }).pipe(
    catchError((error) => {
        console.error('Error en la autenticacion: ', error)
        return throwError(() => new Error(`Error al traer los datos de ${masterTable}. Intente nuevamente.`))
    })
    )
  }

  


create(masterTable:string,  reg: any): Observable<any> {
    const url = `${this.apiUrl}${masterTable}/create`;
    return this.http.post<any>(url, reg, { headers: this.getHeaders() }).pipe(
    catchError((error) => {
        console.error(`Error al crear   ${masterTable} :`, error);
        return throwError(() => new Error(`Error al crear  ${masterTable}`));
    })
    );
}

update(masterTable:string, reg: any): Observable<any> {
    if (!reg.id) {
    console.error('El objeto  no tiene un ID válido');
    return throwError(() => new Error('No se puede actualizar la  sin un ID válido'));
    }

    const url = `${this.apiUrl}${masterTable}/${reg.id}`;

    return this.http.put<any>(url, reg, { headers: this.getHeaders() }).pipe(
    catchError((error) => {
        console.error(`Error al editar ${masterTable}`, error);
        return throwError(() => new Error(`Error al editar ${masterTable}`));
    })
    );
}

delete(masterTable:string, id: number): Observable<any> {
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