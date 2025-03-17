import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';


/** Importar Servicios */
import { LoadingService } from 'src/app/services/loading.service';
import { ToastService } from 'src/app/services/toast.service';
import { AuthService } from 'src/app/services/auth.service';


@Component({
  selector: 'app-sign-up',
  templateUrl: './sign-up.page.html',
  styleUrls: ['./sign-up.page.scss'],
  standalone: false,
})
export class SignUpPage implements OnInit {


  /** Paso 1 : Definir el Formulario y sus campos */
  public registerForm = new FormGroup({ 
        identificacion: new FormControl(null, [Validators.required, Validators.minLength(8), Validators.maxLength(10), Validators.pattern('^[0-9]*$') ]),
        name: new FormControl(null, [ Validators.minLength(4), Validators.pattern('^[a-zA-Z\\s]*$')]),
        email: new FormControl(null, [Validators.email]),
        celphone: new FormControl(null, [Validators.minLength(8), Validators.maxLength(10), Validators.pattern('^[0-9]*$')]),
        password: new FormControl(null, [Validators.required, Validators.minLength(10), Validators.maxLength(18)]),
  });

  constructor(   private _router: Router,
    private _authService: AuthService,
    private _toastService: ToastService, 
    private _loadingService: LoadingService,
  ) { }

  ngOnInit() {
  }


  async register() {
    console.log('Formulario enviado'); // Confirmación en consola
  
    /** Paso 1:  Validar Formulario */
    if (this.registerForm.invalid) {
      console.log('Formulario inválido:', this.registerForm.errors);
      this._toastService.presentToast('alert-circle-outline','Por favor completa todos los campos correctamente.', 'danger', 'top');
      return;
    }
  
     /** Paso 2:  formdata */
    const formData = this.registerForm.value;
    console.log('Datos enviados:', formData); // Verifica los datos enviados
    await this._loadingService.showLoading("Registrando...");
  
     /** Paso 3:  Registrar en servidor.. */
    this._authService.register(formData).subscribe({
      next: async (response) => {
        console.log('Respuesta del servidor:', response);
        await this._loadingService.hideLoading();
        this._toastService.presentToast('people-outline','Usuario registrado exitosamente', 'success', 'top');
        this._router.navigate(['auth']);
      },
      error: async (error) => {
        console.error('Error al registrar usuario:', error);
        await this._loadingService.hideLoading();
        this._toastService.presentToast('alert-circle-outline','Error al registrar usuario', 'danger', 'top');
      },
    });
  }

}
