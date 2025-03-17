import { Injectable } from '@angular/core';
import { ToastController } from '@ionic/angular';

@Injectable({
  providedIn: 'root'
})
export class ToastService {

  constructor(private _toastController: ToastController) { }

  async presentToast(icon: string, message: string, color: string, position : any) {
    const toast = await this._toastController.create({
      icon,
      message,
      color,
      position,
      duration: 3000
    });
    toast.present();
  }
}

/** ionic g service services/toast */