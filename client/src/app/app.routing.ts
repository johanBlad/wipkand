//https://angular.io/guide/router
import { RouterModule, Routes, Router } from '@angular/router';
import { NgModule } from '@angular/core';

import { AuthComponent } from './auth/auth.component';
import { AuthLogoutComponent } from './auth-logout/auth-logout.component'
import { BatchHistoryComponent } from './batch-history/batch-history.component';
import { BatchHistoryDetailComponent } from './batch-history-detail/batch-history-detail.component'; 

import { FloorstockComponent } from './floorstock/floorstock.component';
import { HomeComponent } from './home/home.component';
import { ScoreboardComponent } from './scoreboard/scoreboard.component';
import { ShiftChangeComponent } from './shift-change/shift-change.component';


import { BatchReworkComponent } from './batch-rework/batch-rework.component';



const appRoutes: Routes = [   
    {
       path:"",
       redirectTo: '/home', 
       pathMatch: 'full' 
    },
    {
        path:"login",
        component: AuthComponent,
    },
    {
        path:"logout",
        component: AuthLogoutComponent,
    },
    {
        path:"batch-history",
        component: BatchHistoryComponent,
    },
    {
        path:"batch-history/:id",
        component: BatchHistoryDetailComponent,
    },
    {
        path:"floorstock",
        component: FloorstockComponent,
    },
    {
        path:"home",
        component: HomeComponent,
    },
    {
        path:"scoreboard",
        component: ScoreboardComponent,
    },
    {
        path:"shift-change",
        component: ShiftChangeComponent,
    },
    


    {
        path:"batch-rework",
        component: BatchReworkComponent,
    },
]

@NgModule({
    imports: [
        RouterModule.forRoot(
            appRoutes
        )
    ],
    exports: [
        RouterModule
    ]
})
export class AppRoutingModule {}