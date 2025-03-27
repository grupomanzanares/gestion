import { Component, OnInit } from '@angular/core';
import {  FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';



/** Importar Servicios */
import { LoadingService } from 'src/app/services/loading.service';
import { ToastService } from 'src/app/services/toast.service';
import { AuthService } from 'src/app/services/auth.service';
import { StorageService } from 'src/app/services/storage.service';


@Component({
  selector: 'app-auth',
  templateUrl: './auth.page.html',
  styleUrls: ['./auth.page.scss'],
  standalone: false 
})
export class AuthPage implements OnInit {


  errorMessage: string = '';

  /** Paso 1 : Definir el Formulario y sus campos */
  /** loginForm se relaciona en el aut.page.html */
  public loginForm = new FormGroup({
    identificacion: new FormControl(null, [Validators.required, Validators.minLength(8), Validators.maxLength(10), Validators.pattern('^[0-9]*$'),]),
    password: new FormControl(null,[Validators.required, Validators.minLength(10), Validators.maxLength(18)]),
  });

  constructor( 
    private _router: Router,
    private _authService: AuthService,
    private _toastService: ToastService, 
    private _loadingService: LoadingService,
    private _storageService: StorageService
    
  ) { }

  ngOnInit() {
  }

  async login() {

    /** Paso1: Validar formulario */
    if (this.loginForm.invalid) {
      this._toastService.presentToast('alert-circle-outline','Por favor completa todos los campos correctamente.', 'danger', 'top');
      return; // Salir si el formulario no es válido
    }

    /** Paso2: Extraer los datos */
    let { identificacion , password } = this.loginForm.value;
    identificacion = Number(identificacion);
    password = String(password);
    

    /** Paso3: Mostrar cargador */
    await this._loadingService.showLoading("Validando Credenciales"); 

    /** Paso4: Autenticar con el servidor */ 
    this._authService.login(identificacion, password).subscribe({
      next: async (response) => {
        await this._loadingService.hideLoading(); /** Ocultar Cargador */ 

        /**Valida que el token esté presente en la respuesta */ 
        if (response.token) {
          const userName = response.user?.name || 'Usuario';
          this._storageService.save('manzanares-user', response.user)  // Guarda el token y usuario en localStorage
          this._storageService.save('manzanares-token', response.token)  // Guarda el token y usuario en localStorage
          // this._storageService.save('manzanares-rol', response.rol)  
          // this._router.navigate(['home']); // Redireccionar al home
          this._router.navigateByUrl('main');
          this.loginForm.reset();         // Limpia el formulario
          this._toastService.presentToast('people-outline',`Bienvenid@ ${response.user.name}`, 'success', 'top');
        } else {
          this._toastService.presentToast('alert-circle-outline','Error inesperado. Intenta nuevamente.', 'danger', 'top');
          console.error('Token faltante en la respuesta:', response);
        }
      },
      error: async (error) => {
        await this._loadingService.hideLoading(); // Ocultar cargador

        /**  Muestra un mensaje amigable al usuario*/  
        this._toastService.presentToast('alert-circle-outline','Credenciales incorrectas. Por favor, intenta nuevamente.', 'danger', 'top');
        console.error('Error de autenticación:', error);

        // Opcional: Establecer un mensaje de error en la interfaz
        this.errorMessage = 'Credenciales incorrectas. Por favor, intenta nuevamente.';
      },
    });
  }

}
