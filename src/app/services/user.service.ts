import { Injectable, Type } from '@angular/core';
import {
    AngularFirestore,
    DocumentReference,
} from '@angular/fire/compat/firestore';
import { User } from 'firebase/auth';

@Injectable({
    providedIn: 'root',
})
export class UserService {
    constructor(private store: AngularFirestore) {}

    public getUsers() {
        return this.store.collection('users');
    }

    public create(user: User): Promise<DocumentReference<unknown>> {
        return this.store.collection('users').add({
            email: user.email,
            id: user.uid,
            active: true,
        });
    }
}
