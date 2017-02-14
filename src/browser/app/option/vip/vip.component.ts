import {Component, Optional, ViewEncapsulation, Inject, Input, NgZone, TemplateRef, ViewChild} from '@angular/core';
import {SettingsService} from './../../../shared/settings/settings.service';
import {NgbModal} from "@ng-bootstrap/ng-bootstrap";
import {Http, URLSearchParams} from "@angular/http";


@Component({
    selector: 'option-shortcuts',
    templateUrl: 'app/option/vip/vip.component.html',
    styleUrls: ['app/option/vip/vip.component.css'],
    host: {}
})
export class VipComponent {

    @ViewChild('authentication') authTmpl: TemplateRef<any>;
    @ViewChild('main') mainTmpl: TemplateRef<any>;
    @ViewChild('modal') modalTmpl: TemplateRef<any>;

    private vip_id: string;

    constructor(private settingsService: SettingsService,
                private modalService: NgbModal,
                private http: Http) {
    }

    getTemplate() {
        return this.authTmpl;
    }

    validate() {
        /*this.modalService.open(this.modalTmpl, {}).result.then((result) => {

         }, (reason) => {

         });*/

        let params: URLSearchParams = new URLSearchParams();
        params.set('vip_id', this.vip_id);

        this.http.get('http://dofustouch.no-emu.com/update/tipeee.php', params)
            .map(res => res.json())
            .subscribe((data) => {

                if(data.ok){
                    alert('VIP ID valide, vous pouvez redemarrer DTNE pour profiter de nouvelles fonctionnalités');
                }else{
                    alert('VIP ID non valide');
                }
            });
    }
}
