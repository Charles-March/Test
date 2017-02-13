import {Component, Optional, ViewEncapsulation, Inject, Input, NgZone} from '@angular/core';
import { SettingsService } from './../../../shared/settings/settings.service';


@Component({
    selector: 'option-shortcuts',
    templateUrl: 'app/option/vip/vip.component.html',
    styleUrls: ['app/option/vip/vip.component.css'],
    host: {

    }
})
export class VipComponent {

    constructor(
        private settingsService: SettingsService
    ){}
}
