import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { FileRequest } from '../models/file-request.mode';

@Injectable({
    providedIn: 'root',
})
export class RequestFileService {
    constructor(private store: AngularFirestore) {}

    public create(fileRequest: FileRequest) {
        return this.store.collection('build-requests').add(fileRequest);
    }

    public getChunks(mapId: string) {
        return this.store.firestore
            .collection('request-chunks')
            .where('mapId', '==', mapId)
            .get();
    }
}
