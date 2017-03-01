import {
    Component, Optional, ViewEncapsulation, Inject, Input, NgZone, TemplateRef, ViewChild,
    OnInit
} from '@angular/core';
import {SettingsService} from './../../../shared/settings/settings.service';
import {NgbModal} from "@ng-bootstrap/ng-bootstrap";
import {Http, URLSearchParams} from "@angular/http";
import {ApplicationService} from "../../../shared/electron/application.service";
import {TranslateService} from "ng2-translate";

const {shell} = (<any>global).nodeRequire('electron').remote;

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
    private staticAlertClosed: boolean;

    constructor(private settingsService: SettingsService,
                private modalService: NgbModal,
                private applicationService : ApplicationService,
                private translate: TranslateService,
                private http: Http) {
    }

    getTemplate() {
        if (!this.applicationService.vipStatus) {
            return this.authTmpl;
        }else{
            return this.mainTmpl;
        }

    }

    goDiscord(event: any){
        shell.openExternal('https://discordapp.com/invite/rCawwmD');
        event.preventDefault();
    }

    validate() {
        /*this.modalService.open(this.modalTmpl, {}).result.then((result) => {

         }, (reason) => {

         });*/

        this.http.get(`${this.applicationService.website}/tipeee.php?vip_id=${this.vip_id}`)
            .map(res => res.json())
            .subscribe((data) => {
                if(data.status){

                    let status = [null, 'Tiwabbit', 'Wabbit', 'Grand Pa Wabbit', '42', 'Boss Wa Wabbit', 'Cresus MasterRace'];
                    alert(`Merci ! Votre compte VIP "${status[data.status]}" a bien été activé ! Vous devez redemérrarer l'application pour profiter des nouvelles fonctionnalités`);
                    this.settingsService.vip_id = this.vip_id;
                }else{
                    alert('VIP ID non valide');
                }
                
            });
    }
}
