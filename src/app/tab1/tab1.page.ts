import { Component } from '@angular/core';

@Component({
    selector: 'app-tab1',
    templateUrl: 'tab1.page.html',
    styleUrls: ['tab1.page.scss'],
})
export class Tab1Page {
    constructor() {}

    public async onFilePick(files: FileList) {
        const base64 = await this.encodeFileToBase64(files.item(0));
        const imageChunks = this.splitImage(base64);

        // get users

        // map chunks yo users

        // send the chunks to the users

        // hash the map with password

        // send the map to the cound
    }

    public splitImage(base64: string): string[] {
        // get active users count, we will work with 2 for now
        const activeUsers = 2;

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
}
