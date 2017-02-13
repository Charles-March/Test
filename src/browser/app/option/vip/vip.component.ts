import {Component, Optional, ViewEncapsulation, Inject, Input, NgZone, TemplateRef, ViewChild} from '@angular/core';
import { SettingsService } from './../../../shared/settings/settings.service';
import {NgbModal} from "@ng-bootstrap/ng-bootstrap";


@Component({
    selector: 'option-shortcuts',
    templateUrl: 'app/option/vip/vip.component.html',
    styleUrls: ['app/option/vip/vip.component.css'],
    host: {

    }
})
export class VipComponent {

    @ViewChild('authentication') authTmpl : TemplateRef<any>;
    @ViewChild('main') mainTmpl: TemplateRef<any>;
    @ViewChild('modal') modalTmpl: TemplateRef<any>;

    private vip_id: string;

    constructor(
        private settingsService: SettingsService,
        private modalService: NgbModal,
    ){}

    getTemplate(){
        return this.authTmpl;
    }

    validate(){
        /*this.modalService.open(this.modalTmpl, {}).result.then((result) => {

        }, (reason) => {

        });*/
        alert('VIP ID valide, vous pouvez redemarrer DTNE pour profiter de nouvelles fonctionnalités');
    }
}
