/** @format */

import { Component } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import * as fb from 'firebase/auth';

@Component({
    selector: 'app-root',
    templateUrl: 'app.component.html',
    styleUrls: ['app.component.scss'],
})
export class AppComponent {
    constructor(private store: AngularFirestore) {}
}
