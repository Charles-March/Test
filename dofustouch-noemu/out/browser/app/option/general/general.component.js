"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
const core_1 = require("@angular/core");
const settings_service_1 = require("./../../../shared/settings/settings.service");
let GeneralComponent = class GeneralComponent {
    constructor(settingsService) {
        this.settingsService = settingsService;
        this.resolutions = [
            { name: '960x540', value: "960;540" },
            { name: '1280x720', value: "1280;720" },
            { name: '1600x900', value: "1600;900" },
            { name: '2560x1440', value: "2560;1440" }
        ];
    }
    setResolution(value) {
        let aValue = value.split(';');
        let resolution = {
            x: parseInt(aValue[0]),
            y: parseInt(aValue[1])
        };
        this.settingsService.option.general.resolution = resolution;
    }
    ngOnInit() {
        // fixe the two way binding object by this tricks
        console.log('onInit General');
        this._resolution = this.settingsService.option.general.resolution.x + ';' + this.settingsService.option.general.resolution.y;
        console.log(this._resolution);
    }
};
GeneralComponent = __decorate([
    core_1.Component({
        selector: 'option-general',
        templateUrl: 'app/option/general/general.component.html',
        styleUrls: ['app/option/general/general.component.css'],
        host: {}
    }),
    __metadata("design:paramtypes", [settings_service_1.SettingsService])
], GeneralComponent);
exports.GeneralComponent = GeneralComponent;

//# sourceMappingURL=general.component.js.map
