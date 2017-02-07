import { NgModule } from '@angular/core';
import { BrowserModule  } from '@angular/platform-browser';

import {SharedModule} from '../shared/shared.module';

import { AppComponent } from './app.component';
import { routing } from './app.routing';
import {APP_BASE_HREF} from "@angular/common";
import {NgbModule} from "@ng-bootstrap/ng-bootstrap";

@NgModule({
  imports: [
    BrowserModule,
    SharedModule.forRoot(),
    NgbModule.forRoot(),
    routing
  ],
  declarations: [
    AppComponent
  ],
  providers: [
    {provide: APP_BASE_HREF, useValue: '/'} // hack to work routing on electron
  ],
  bootstrap: [AppComponent]
})
export class AppModule {}
