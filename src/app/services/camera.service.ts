import { Injectable } from '@angular/core';
import { Camera, CameraResultType, CameraSource } from '@capacitor/camera';

@Injectable({
    providedIn: 'root'
})
export class CameraService {

    constructor() { }



async takePicture () {
    return await Camera.getPhoto({
        quality: 90,
        allowEditing: true,
        resultType: CameraResultType.DataUrl,  /** aqui mirar si podemos colocar en base 64 */
        source: CameraSource.Prompt,
        promptLabelHeader: '📷\nSelecciona ó Toma una fotografía',
        promptLabelPhoto:  'Selecciona foto',
        promptLabelPicture: 'Toma una foto'
        });
}





  // image.webPath will contain a path that can be set as an image src.
  // You can access the original file using image.path, which can be
  // passed to the Filesystem API to read the raw data of the image,
  // if desired (or pass resultType: CameraResultType.Base64 to getPhoto)
  //var imageUrl = image.webPath;

  // Can be set to the src of an image now
  //imageElement.src = imageUrl;
};




/** 
 * 
 *
 * Instalacion de capacitor para el uso de camara
    capacitorjs.com/docs/web/pwa-elements
        npm install @capacitor/camera
        npm install @ionic/pwa-elements

    configurar el archivo main.ts
            import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';

            import { AppModule } from './app/app.module';

            import { defineCustomElements } from '@ionic/pwa-elements/loader';
            import { environment } from './environments/environment';
            import { enableProdMode } from '@angular/core';

            platformBrowserDynamic().bootstrapModule(AppModule)
            .catch(err => console.log(err));



            // Call the element loader before the bootstrapModule/bootstrapApplication call
            defineCustomElements(window);
            if (environment.production) {
            enableProdMode();
            }

    ionic g service services/camera
    Crear el servicio  camera.service.ts 
 */
