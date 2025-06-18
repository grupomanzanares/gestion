import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MasterService } from 'src/app/services/gestion/master.service';
import { LoadingService } from 'src/app/services/loading.service';
import { ToastService } from 'src/app/services/toast.service';

@Component({
  selector: 'app-usuarios',
  templateUrl: './usuarios.page.html',
  styleUrls: ['./usuarios.page.scss'],
  standalone: false
})
export class UsuariosPage implements OnInit {

  public showForm: boolean;
  usuarios: any[] = []
  roles: any[] = []
  public edit : boolean = false
  public selecUser

  public inputs = new FormGroup({
    identificacion: new FormControl(null, [Validators.required]),
    name: new FormControl(null, [Validators.required]),
    email: new FormControl(null, [Validators.email]), 
    celphone: new FormControl(null, [Validators.required]),
    rolId: new FormControl(null, [Validators.required])
  })

  constructor(private master: MasterService, private toastService: ToastService, private loading: LoadingService) { }

  ngOnInit() {
    this.getUsuarios()
    this.getRol()
  }

  onShowForm(){
    this.showForm = true;
    this.getUsuarios()
  }

  onCloseForm(){
    this.showForm = false
  }

  getUsuarios() {
    this.loading.showLoading()
    this.master.get('users').subscribe({
      next: (data) => {
        console.log('Datos de usuarios ', data)
        this.usuarios = data
        this.loading.hideLoading()
      }, error: (error) => {
        console.error('Error al traer a los usuarios', error)
      }
    })
  }

  getRol() {
    this.master.get('roles').subscribe({
      next: (data) => {
        console.log(data)
        this.roles = data
      }, error : (error) => {
        console.error('Error al traer los datos', error)
      }
    })
  }

  updateUser() {
    if (this.inputs.valid) {
      const data: any = { ...this.inputs.value };
  
      if (this.edit) {
        const id = this.selecUser.id;
        this.master.update(data, 'users', id).subscribe({
          next: () => {
            this.toastService.presentToast('checkmark-outline', 'Usuario actualizado exitosamente', 'success', 'top');
            this.showForm = false;
            this.getUsuarios();
            this.edit = false;
          },
          error: (error) => {
            console.error('Error al actualizar el usuario', error);
            this.toastService.presentToast('alert-outline', 'Error al actualizar el usuario', 'danger', 'top');
          }
        });
      } else {
        this.master.create('users', data).subscribe({
          next: () => {
            this.toastService.presentToast('checkmark-outline', 'Usuario creado exitosamente', 'success', 'top');
            this.showForm = false;
            this.getUsuarios();
          },
          error: (error) => {
            console.error('Error al crear el usuario', error);
            this.toastService.presentToast('alert-outline', 'Error al crear el usuario', 'danger', 'top');
          }
        });
      }
    } else {
      console.error('Formulario inválido:', this.inputs.errors);
      this.toastService.presentToast('alert-outline', 'Por favor, completa todos los campos correctamente', 'danger', 'top');
    }
  }
  
  update(usuario: any) {
    this.inputs.patchValue({
      identificacion: usuario.identificacion,
      name: usuario.name,
      email: usuario.email,
      celphone: usuario.celphone,
      rolId: usuario.rolId
    });
  
    this.selecUser = usuario;
    this.edit = true;
    this.showForm = true;
  }
  
  delete(id: number) {
    if (!id) {
      console.error('El Id no es válido para eliminar');
      this.toastService.presentToast('alert-outline', 'Id inválido para eliminar', 'danger', 'top');
      return;
    }
  
    const confirmDelete = confirm('¿Estás seguro de que deseas eliminar a este usuario?');
    if (!confirmDelete) return;
  
    this.master.delete('users', id).subscribe({
      next: () => {
        this.toastService.presentToast('alert-outline', 'Usuario eliminado exitosamente', 'success', 'top');
        this.getUsuarios();
      },
      error: (error) => {
        console.error('Error al eliminar al usuario:', error);
        this.toastService.presentToast('alert-outline', 'Error al eliminar al usuario', 'danger', 'top');
      }
    });
  }  

}
