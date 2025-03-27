import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { AuthService } from 'src/app/services/auth.service';
import { MasterService } from 'src/app/services/gestion/master.service';
import { StorageService } from 'src/app/services/storage.service';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.page.html',
  styleUrls: ['./profile.page.scss'],
  standalone: false
})
export class ProfilePage implements OnInit {

  usuarios: any[] = []

  public inputs = new FormGroup({
    name: new FormControl(null, [Validators.required]),
    email: new FormControl(null, [Validators.email]),
    celphone: new FormControl(null, [Validators.required]),
    password: new FormControl(null, [Validators.minLength(10), Validators.maxLength(18)])
  })

  constructor(private storage: StorageService, private master: MasterService) { }

  ngOnInit() {
    this.getUser()
  }

  async obtenerIdUsuario() {
    const user = await this.storage.get("manzanares-user");
    if (user) {
      console.log("ID del usuario:", user.id);
      return user.id;
    } else {
      console.log("No hay datos en Local Storage.");
      return null;
    }
  }


  async getUser() {
    const id = await this.obtenerIdUsuario()
    this.master.getId('users', id).subscribe({
      next: (data) => {
        console.log("datos recibidos", data)
        this.usuarios = Array.isArray(data) ? data : [data];

        if (this.usuarios.length > 0) {
          this.inputs.patchValue({
            name: this.usuarios[0].name,
            email: this.usuarios[0].email,
            celphone: this.usuarios[0].celphone
          })
        }
      }, error: (error) => {
        console.error('Error al traer a los usuarios', error)
      }
    })
  }

  updateUser() {
    if (this.inputs.invalid) {
      console.warn('Formulario inválido');
      return;
    }

    const updatedUser = this.inputs.value;
    const userId = this.usuarios[0].id;
    if (!userId) {
      console.error('No se encontró el ID del usuario');
      return;
    }

    this.master.update(updatedUser, 'users', userId).subscribe({
      next: (response) => {
        console.log('Usuario actualizado con éxito:', response);
      },
      error: (error) => {
        console.error('Error al actualizar el usuario:', error);
      }
    });
  }


}
