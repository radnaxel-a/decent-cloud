import { Injectable } from '@angular/core';
import { ToastController } from '@ionic/angular';

@Injectable({
    providedIn: 'root',
})
export class ToastService {
    constructor(private toastCtrl: ToastController) {}

    public async success(message: string): Promise<void> {
        const toast = await this.toastCtrl.create({
            duration: 2000,
            message,
            position: 'top',
            color: 'success',
        });

        return toast.present();
    }

    public async error(message: string): Promise<void> {
        const toast = await this.toastCtrl.create({
            duration: 2000,
            message,
            position: 'top',
            color: 'error',
        });

        return toast.present();
    }
}
