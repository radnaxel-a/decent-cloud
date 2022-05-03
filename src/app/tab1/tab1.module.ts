import { IonicModule } from '@ionic/angular';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Tab1Page } from './tab1.page';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
    {
        path: '',
        component: Tab1Page,
    },
];

@NgModule({
    imports: [
        RouterModule.forChild(routes),
        RouterModule,
        IonicModule,
        CommonModule,
        FormsModule,
    ],
    declarations: [Tab1Page],
})
export class Tab1PageModule {}
