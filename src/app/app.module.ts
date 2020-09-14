import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import {SharedModule} from './shared/shared.module';
import { FormsModule } from '@angular/forms';
import { AppRoutingModule } from './app-routing.module';

import {SmsModule} from './sms/sms.module';
import { NgxUiLoaderModule } from  'ngx-ui-loader';
import { ToastrModule } from 'ngx-toastr';
import { RouterModule } from '@angular/router';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { AppComponent } from './app.component';
import { AppApiEndpoints } from './app.api-endpoints';
import { AppSettings } from './app.settings';
import {AutocompleteLibModule} from 'angular-ng-autocomplete';


@NgModule({
  declarations: [
    AppComponent,
  ],
  imports: [
    BrowserModule,
    RouterModule,
    AppRoutingModule,
    SharedModule,
    SmsModule,
    NgxUiLoaderModule,
    FormsModule,
    ToastrModule.forRoot({closeButton:true}),
    BrowserAnimationsModule,
    AutocompleteLibModule
  ],
  providers: [AppApiEndpoints,ToastrModule,AppSettings],
  bootstrap: [AppComponent]
})
export class AppModule { }
