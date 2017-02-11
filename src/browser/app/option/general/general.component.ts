import {Component, OnInit} from '@angular/core';
import { SettingsService } from './../../../shared/settings/settings.service';
import {TranslateService} from "ng2-translate";

interface select {
    name: string;
    value: string;
}

@Component({
    selector: 'option-general',
    templateUrl: 'app/option/general/general.component.html',
    styleUrls: ['app/option/general/general.component.css'],
    host: {

    }
})
export class GeneralComponent implements OnInit{

    private _resolution: string;
    private _language: string;

    public resolutions: select[] = [
        { name: '960x540', value: "960;540" },
        { name: '1280x720', value: "1280;720" },
        { name: '1600x900', value: "1600;900" },
        { name: '2560x1440', value: "2560;1440" }
    ];

    public languages: select[] = [
        { name: 'Français', value: "fr" },
        { name: 'English', value: "en" },
        { name: 'Espagnol', value: "es" }
    ];

    constructor(
        private translate: TranslateService,
        private settingsService: SettingsService
    ){

    }

    public setLanguage(): void {
        this.translate.use(this._language);
    }

    public setResolution(value: string): void {
        let aValue = value.split(';');

        let resolution = {
            x: parseInt(aValue[0]),
            y: parseInt(aValue[1])
        }

        this.settingsService.option.general.resolution = resolution;
    }

    ngOnInit(): void {
        // fixe the two way binding object by this tricks
        console.log('onInit General');
        this._resolution = this.settingsService.option.general.resolution.x+';'+this.settingsService.option.general.resolution.y;

        console.log(this._resolution);

    }

}
