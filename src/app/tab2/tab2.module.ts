import { IonicModule } from '@ionic/angular';
import { RouterModule, Routes } from '@angular/router';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Tab2Page } from './tab2.page';

const routes: Routes = [
    {
        path: '',
        component: Tab2Page,
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
    declarations: [Tab2Page],
})
export class Tab2PageModule {}
