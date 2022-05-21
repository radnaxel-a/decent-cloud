/* eslint-disable @typescript-eslint/naming-convention */
/* eslint-disable prefer-arrow/prefer-arrow-functions */
import { Component, OnInit } from '@angular/core';
import { User } from '../models/user.model';
import { AuthService } from '../services/auth-service.service';
import { ToastService } from '../services/toast.service';
import { UserService } from '../services/user.service';
import { take } from 'rxjs/operators';
import { getAuth } from 'firebase/auth';
import { AlertController } from '@ionic/angular';
import Rabbit from 'crypto-js/rabbit';
// import { Filesystem, Directory, Encoding } from '@capacitor/filesystem';

import { MapService } from '../services/map.service';
import { ChunkService } from '../services/chunk.service';
import { Filesystem } from '@capacitor/filesystem';

@Component({
    selector: 'app-tab1',
    templateUrl: 'tab1.page.html',
    styleUrls: ['tab1.page.scss'],
})
export class Tab1Page implements OnInit {
    public users = [];
    public fileName: string;

    private lastFileChunksSize = 0;

    constructor(
        private authService: AuthService,
        private toastService: ToastService,
        private userService: UserService,
        private alertCtrl: AlertController,
        private mapService: MapService,
        private chunkService: ChunkService
    ) {}

    public ngOnInit(): void {}

    public async onFilePick(files: FileList) {
        // get users
        this.userService
            .getUsers()
            .valueChanges()
            .pipe(take(1))
            .subscribe(async (users: any) => {
                const file = files.item(0);
                this.fileName = file.name;

                this.users = users
                    .filter((x: User) => x.active)
                    .filter((x: User) => x.id !== getAuth().currentUser.uid);

                const base64 = await this.encodeFileToBase64(file);
                this.encryptFile(base64);
            });
    }

    public async encryptFile(base64: string): Promise<void> {
        const buttons = [
            {
                text: 'ok',
                role: 'cancel',
                handler: (ev) => {
                    console.log('om');
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
            const hash = Rabbit.encrypt(base64, key);

            this.chunkEncrypt(hash.toString());
        });

        alert.present();
    }

    public chunkEncrypt(hash: string): void {
        const chunks = this.splitImage(hash);
        this.createChunks(chunks);
    }

    public async createChunks(chunks: string[]): Promise<void> {
        const map = await this.mapService.create({
            userId: getAuth().currentUser.uid,
            name: this.fileName,
            chunkCount: chunks.length,
        });

        // eslint-disable-next-line @typescript-eslint/prefer-for-of
        for (let i = 0; i < chunks.length; i++) {
            const userIndex = Math.trunc(Math.random() * this.users.length);
            const chunk = {
                user_id: this.users[userIndex].id,
                chunk: `${i}${chunks[i]}`,
                map_id: map.id,
            };

            this.chunkService.create(chunk);
        }

        this.toastService.success('File uploaded successfully');
    }

    public splitImage(base64: string): string[] {
        // get active users count, we will work with 2 for now
        // check file length, make that much chunks / 1, 000, 000
        const activeUsers = Math.ceil(base64.length / 500000);

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

    public logout(): void {
        this.authService.logOut();
    }
}
