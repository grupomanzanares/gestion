import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';
import { LoadingService } from 'src/app/services/loading.service';
import { ToastService } from 'src/app/services/toast.service';

@Component({
  selector: 'app-reset-password',
  templateUrl: './reset-password.page.html',
  styleUrls: ['./reset-password.page.scss'],
  standalone: false
})

export class ResetPasswordPage implements OnInit {

  token: string = '';

  public resetPasswordForm = new FormGroup({ 
    password: new FormControl(null, [Validators.required, Validators.minLength(10), Validators.maxLength(18)]),
    confirmPassword: new FormControl(null, [Validators.required, Validators.minLength(10), Validators.maxLength(18)]),
    
});  
  


  constructor(private _router: Router,
        private _authService: AuthService,
        private _toastService: ToastService, 
        private _loadingService: LoadingService, private route: ActivatedRoute) { }

  ngOnInit() {
          // Obtener el token de la URL
          this.token = this.route.snapshot.paramMap.get('token') || '';
      
          // Validar el token antes de mostrar el formulario
          this._authService.validateToken(this.token).subscribe({
            next: () => {
              console.log('Token válido, se muestra el formulario.');
            },
            error: (error) => {
              this._toastService.presentToast('alert-circle-outline', 'El enlace de recuperación no es válido o ha expirado.', 'danger', 'top');
              this._router.navigate(['/auth/forgot-password']); // Redirige a la pantalla de "olvidé mi contraseña"
            }
          });
        }
      

  async resetPassword() {
    if (this.resetPasswordForm.invalid) {
      this._toastService.presentToast('alert-circle-outline', 'Por favor completa todos los campos correctamente.', 'danger', 'top');
      return;
    }

    const { password,confirmPassword } = this.resetPasswordForm.value;

    if (password !== confirmPassword) {
      this._toastService.presentToast('alert-circle-outline', 'Las contraseñas no coinciden.', 'danger', 'top');
      return;
    }

    await this._loadingService.showLoading("Restableciendo contraseña...");

    this._authService.resetPassword(this.token, password).subscribe({
      next: async () => {
        await this._loadingService.hideLoading();
        this._toastService.presentToast('checkmark-outline', 'Contraseña restablecida con éxito.', 'success', 'top');
        this._router.navigateByUrl('/auth');
      },
      error: async (error) => {
        await this._loadingService.hideLoading();
        this._toastService.presentToast('alert-circle-outline', 'Error al restablecer la contraseña. Intente nuevamente.', 'danger', 'top');
        console.error('Error en el restablecimiento de contraseña:', error);
      }
    });
  }

}
