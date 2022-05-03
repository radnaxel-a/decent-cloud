/** @format */

import { Component } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';

@Component({
    selector: 'app-root',
    templateUrl: 'app.component.html',
    styleUrls: ['app.component.scss'],
})
export class AppComponent {
    constructor(private store: AngularFirestore) {
        this.store
            .collection('maps')
            .valueChanges()
            .subscribe((data) => {
                console.log(data);
            });
    }
}
