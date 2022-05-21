import { Injectable } from '@angular/core';
import {
    AngularFirestore,
    DocumentData,
    DocumentReference,
    QuerySnapshot,
} from '@angular/fire/compat/firestore';
import { getAuth } from 'firebase/auth';
import { Observable } from 'rxjs';
import { Map } from '../models/map';

@Injectable({
    providedIn: 'root',
})
export class MapService {
    constructor(private store: AngularFirestore) {}

    public create(map: Map): Promise<DocumentReference<unknown>> {
        return this.store.collection('maps').add(map);
    }

    public get(): Promise<QuerySnapshot<DocumentData>> {
        const userId = getAuth().currentUser.uid;
        console.log(userId);

        return this.store.firestore
            .collection('maps')
            .where('userId', '==', userId)
            .get();
    }
}
