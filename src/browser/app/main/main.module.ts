import {NgModule, APP_INITIALIZER} from '@angular/core';
import {CommonModule} from '@angular/common';
import {TranslateModule} from "ng2-translate";
import {NgbModule} from "@ng-bootstrap/ng-bootstrap";

/* Shared Module */
import {SharedModule} from './../../shared/shared.module';

import {MainRoutingModule} from './main.routing';

/* MainComponent */
import {MainComponent} from './main.component';
import {GameComponent, SafePipe} from './game/game.component';
import {TabService} from './tab/tab.service';


@NgModule({
    imports: [
        CommonModule,
        SharedModule,
        MainRoutingModule,
        NgbModule,
        TranslateModule
        //DragulaModule
    ],
    providers: [
        TabService,
        {provide: 'Window', useValue: window},
    ],
    declarations: [
        MainComponent,
        GameComponent,
        SafePipe
    ]
})
export class MainModule {
}