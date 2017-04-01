import {NgModule}           from '@angular/core';
import {NgbModule} from '@ng-bootstrap/ng-bootstrap';
import {TranslateModule} from "ng2-translate";

import {SharedModule} from './../../shared/shared.module';

import {UpdateRoutingModule}   from './update-routing.module';
import {UpdateComponent}    from './update.component';

@NgModule({
    declarations: [UpdateComponent],
    imports: [
        SharedModule,
        UpdateRoutingModule,
        NgbModule.forRoot(),
        TranslateModule
    ],
})
export class UpdateModule {
}
