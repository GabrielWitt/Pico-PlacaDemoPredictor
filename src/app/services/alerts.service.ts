import { Injectable } from '@angular/core';
import { ToastController, LoadingController } from '@ionic/angular';

@Injectable({
  providedIn: 'root'
})
export class AlertsService {

  constructor(public toastController: ToastController,public loadingController: LoadingController) {}

  async presentToast(message) {
    const toast = await this.toastController.create({
      message: message,
      duration: 3000
    });
    toast.present();
  }

  async presentToastWithOptions(title,message,position,button?) {
    let buttons = [{ text: 'Terminar', icon: 'check', role: 'cancel', handler: () => { console.log('Cancel clicked');} }];
    if(button) buttons = button;
    const toast = await this.toastController.create({
      header: title,
      message: message,
      position: position,
      buttons: buttons
    });
    toast.present();
  }
  
  async presentLoading(message) {
    const loading = await this.loadingController.create({
      message: message,
      duration: 300
    });
    await loading.present();
  }
}
