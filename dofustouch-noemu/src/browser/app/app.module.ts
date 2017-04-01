import {NgModule} from '@angular/core';
import {BrowserModule} from '@angular/platform-browser';
import {APP_BASE_HREF} from "@angular/common";
import {NgbModule} from "@ng-bootstrap/ng-bootstrap";
import {TranslateModule, TranslateLoader, TranslateStaticLoader} from "ng2-translate";

import {SharedModule} from '../shared/shared.module';
import {AppComponent} from './app.component';
import {routing} from './app.routing';
import {Http} from "@angular/http";


@NgModule({
    imports: [
        BrowserModule,
        SharedModule.forRoot(),
        NgbModule.forRoot(),
        TranslateModule.forRoot({
            provide: TranslateLoader,
            useFactory: (http: Http) => new TranslateStaticLoader(http, '../../i18n/browser', '.json'),
            deps: [Http]
        }),
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
export class AppModule {
}
