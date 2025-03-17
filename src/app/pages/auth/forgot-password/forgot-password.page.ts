import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';
import { LoadingService } from 'src/app/services/loading.service';
import { ToastService } from 'src/app/services/toast.service';

@Component({
  selector: 'app-forgot-password',
  templateUrl: './forgot-password.page.html',
  styleUrls: ['./forgot-password.page.scss'],
  standalone: false,
})
export class ForgotPasswordPage implements OnInit {


  public recoverForm = new FormGroup({
    'identificacion': new FormControl(null, [Validators.required, Validators.minLength(8), Validators.maxLength(10), Validators.pattern('^[0-9]*$') ]),
    'email' : new FormControl(null,[Validators.required, Validators.email])
  })   


  constructor(   private _router: Router,
      private _authService: AuthService,
      private _toastService: ToastService, 
      private _loadingService: LoadingService) { }

  ngOnInit() {
  }

  async recoverPassword() {
    /** Paso1: Validar formulario */
    if (this.recoverForm.invalid) {
      this._toastService.presentToast('alert-circle-outline', 'Por favor completa todos los campos correctamente.', 'danger', 'top');
      return;
    }

    /** Paso2: Extraer los datos */
    let { identificacion, email } = this.recoverForm.value;
    identificacion = Number(identificacion);
    email = String(email);

    /** Paso3: Mostrar cargador */
    await this._loadingService.showLoading("Enviando solicitud...");

    /** Paso4: Enviar solicitud a la API */
    this._authService.forgotPassword(identificacion, email).subscribe({
      next: async (response) => {
        await this._loadingService.hideLoading(); /** Ocultar cargador */
        this._toastService.presentToast('mail-outline', 'Se ha enviado un correo con las instrucciones para recuperar la contraseña.', 'success', 'top');
        this.recoverForm.reset(); /** Limpiar formulario */
        this._router.navigateByUrl('/auth');
      },
      error: async (error) => {
        await this._loadingService.hideLoading(); /** Ocultar cargador */
        this._toastService.presentToast('alert-circle-outline', 'No se pudo enviar la solicitud. Intenta nuevamente.', 'danger', 'top');
        console.error('Error en la recuperación de contraseña:', error);
      }
    });
  }

}
