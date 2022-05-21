import { Component, OnInit } from '@angular/core';
import {
    DocumentData,
    QueryDocumentSnapshot,
} from '@angular/fire/compat/firestore';
import { RequestFileService } from '../service/request-file.service';
import { MapService } from '../services/map.service';
import { ToastService } from '../services/toast.service';
import Rabbit from 'crypto-js/rabbit';
import CryptoJS from 'crypto-js';

@Component({
    selector: 'app-tab2',
    templateUrl: 'tab2.page.html',
    styleUrls: ['tab2.page.scss'],
})
export class Tab2Page implements OnInit {
    public files: QueryDocumentSnapshot<DocumentData>[] = [];

    constructor(
        private mapService: MapService,
        private requestFileService: RequestFileService,
        private toastService: ToastService
    ) {}

    public ngOnInit(): void {
        this.loadFiles();
    }

    public async loadFiles(event = null): Promise<void> {
        this.files = await (await this.mapService.get()).docs;

        if (event) {
            event.target.complete();
        }
    }

    public getFiles(file): void {
        const fileRequest = {
            mapId: file.id,
            chunkCount: file.data().chunkCount,
        };

        this.requestFileService.create(fileRequest);

        this.toastService.success(
            'Files requested. Once they are ready you can see them here'
        );

        this.listenForChunks(file);
    }

    public async listenForChunks(file) {
        // const ids = this.files.map((x) => x.id);
        const chunks = await this.requestFileService.getChunks(file.id);

        let arr = [] as any;

        for (const chunk of chunks.docs) {
            const currentChunk: string = chunk.data().chunk;
            arr.push({
                index: currentChunk.slice(0, 1),
                chunk: currentChunk.slice(1),
            });
        }

        arr = arr.sort((a, b) => a.index - b.index);

        const finalArr = [];

        for (const el of arr) {
            if (finalArr.find((x) => x.index === el.index)) {
                continue;
            }

            finalArr.push(el);
        }

        console.log(finalArr);

        const fileHash = finalArr.map((x) => x.chunk).join('');

        const decrupt = Rabbit.decrypt(fileHash, '123');
        console.log(decrupt.toString(CryptoJS.enc.Utf8));
    }
}
