import { Component } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { User } from '../models/user.model';
import { AuthService } from '../services/auth-service.service';
import { ToastService } from '../services/toast.service';
import { UserService } from '../services/user.service';
import { filter, take } from 'rxjs/operators';
import { getAuth } from 'firebase/auth';
import { AlertButton, AlertController } from '@ionic/angular';

@Component({
    selector: 'app-tab1',
    templateUrl: 'tab1.page.html',
    styleUrls: ['tab1.page.scss'],
})
export class Tab1Page {
    constructor(
        private authService: AuthService,
        private toastService: ToastService,
        private userService: UserService,
        private alertCtrl: AlertController
    ) {}

    public async onFilePick(files: FileList) {
        // get users
        this.userService
            .getUsers()
            .valueChanges()
            .pipe(take(1))
            .subscribe(async (users) => {
                const activeUsers = users
                    .filter((x: User) => x.active)
                    .filter((x: User) => x.id !== getAuth().currentUser.uid);
                const base64 = await this.encodeFileToBase64(files.item(0));
                // map chunks yo users
                const imageChunks = this.splitImage(
                    base64,
                    activeUsers as User[]
                );

                // send the chunks to the users
                const map = this.mapChunksToUsers(
                    activeUsers as User[],
                    imageChunks
                );
                this.encryptMap(map);
            });

        // hash the map with password

        // send the map to the cloud
    }

    public splitImage(base64: string, users: User[]): string[] {
        // get active users count, we will work with 2 for now
        const activeUsers = users.length;

        // get activeUsersLenth equal string chunks of the image
        // loop the string chunking it based on active users
        const chunks = [];
        const length = base64.length;
        const gap = Math.ceil(base64.length / activeUsers);
        let step = 0;

        for (let i = 1; i <= activeUsers; i++) {
            let start = step;
            let stop = step + gap;

            if (i !== 1) {
                start += 1;
            }

            if (stop > length) {
                stop = length;
            }

            const chunk = base64.substring(step, step + gap);
            chunks.push(chunk);
            step += gap;
        }

        return chunks;
    }

    public encodeFileToBase64(file: File): Promise<string> {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.readAsDataURL(file);
            reader.onload = () => resolve(reader.result as string);
            reader.onerror = (error) => reject(error);
        });
    }

    public mapChunksToUsers(
        users: User[],
        chunks: string[]
    ): { userId: string; chunks: string }[] {
        const map = [];

        // eslint-disable-next-line @typescript-eslint/prefer-for-of
        for (let i = 0; i < chunks.length; i++) {
            const userIndex = Math.trunc(Math.random() * users.length);

            map.push({
                userId: users[userIndex].id,
                chunk: chunks[i],
            });
        }

        return map;
    }

    public logout(): void {
        this.authService.logOut();
    }

    private async encryptMap(
        map: { userId: string; chunks: string }[]
    ): Promise<void> {
        const buttons = [
            {
                text: 'ok',
                role: 'cancel',
                handler: (ev) => {
                    console.log(ev);
                },
            },
            {
                text: 'cancel',
                role: 'cancel',
            },
        ];

        const alert = await this.alertCtrl.create({
            inputs: [
                {
                    type: 'password',
                    name: 'Password',
                },
            ],
            header: 'Enter Password',
            message: 'Enter password for encryption',
            buttons,
        });

        alert.onDidDismiss().then(({ data }) => {
            const key = data.values.Password;
            // check crypto js
        });
        alert.present();
    }
}
