import { Injectable } from '@angular/core';
import {
    AngularFirestore,
    DocumentReference,
} from '@angular/fire/compat/firestore';
import { Chunk } from '../models/chunk.model';

@Injectable({
    providedIn: 'root',
})
export class ChunkService {
    constructor(private store: AngularFirestore) {}

    public create(chunk: Chunk): Promise<DocumentReference<unknown>> {
        return this.store.collection('chunks').add(chunk);
    }
}
