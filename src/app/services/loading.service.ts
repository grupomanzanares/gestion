import { Injectable } from '@angular/core';
import { LoadingController } from '@ionic/angular';

@Injectable({
  providedIn: 'root'
})
export class LoadingService {

  private _loadingInstance: HTMLIonLoadingElement | null = null

  constructor(private _loadingController: LoadingController) { }

  async showLoading(message: string = 'Cargando ...'): Promise<void>{
    this._loadingInstance = await this._loadingController.create({
      spinner: 'crescent',
      message,
    });
    await this._loadingInstance.present()
  }


  async hideLoading(): Promise<void> {
    if (this._loadingInstance) {
      await this._loadingInstance.dismiss();
      this._loadingInstance = null;
    }
  }

}

/** ionic g service services/loading */
