import { IonicModule } from '@ionic/angular';
import { RouterModule, Routes } from '@angular/router';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Tab3Page } from './tab3.page';

const routes: Routes = [
    {
        path: '',
        component: Tab3Page,
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
    declarations: [Tab3Page],
})
export class Tab3PageModule {}
