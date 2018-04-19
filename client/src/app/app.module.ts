import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';
import { HttpClientModule } from '@angular/common/http'


import { AppComponent } from './app.component';
import { AppRoutingModule } from './app.routing';


import { ScoreboardComponent } from './scoreboard/scoreboard.component';
import { FloorstockComponent } from './floorstock/floorstock.component';
import { ShiftChangeComponent } from './shift-change/shift-change.component';
import { BatchHistoryComponent } from './batch-history/batch-history.component';

import { BatchReworkComponent } from './batch-rework/batch-rework.component';
import { CurrentBatchInfoComponent } from './current-batch-info/current-batch-info.component';

import { OperationsService } from './operations.service';
import { AuthComponent } from './auth/auth.component';
import { AuthAPIService } from './auth/auth.service';




import { Ng2PageScrollModule } from 'ng2-page-scroll';
import { ExperimentModule } from './experiment/experiment.module';
import { OperationModule } from './operation/operation.module';




@NgModule({
  declarations: [
    AppComponent,



    ScoreboardComponent,
    FloorstockComponent,
    ShiftChangeComponent,
    BatchHistoryComponent,
   
    BatchReworkComponent,
    CurrentBatchInfoComponent,

    AuthComponent,


  ],
  imports: [
    AppRoutingModule,
    BrowserModule,
    FormsModule,
    HttpModule,
    HttpClientModule,
    Ng2PageScrollModule,
    ExperimentModule,

    OperationModule
    
  ],


  providers: [OperationsService],
  bootstrap: [AppComponent]
})
export class AppModule { }

