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
const settings_service_1 = require("./../../../../shared/settings/settings.service");
//const { ipcRenderer } = (<any>global).nodeRequire('electron');
let DiverComponent = class DiverComponent {
    constructor(settingsService) {
        this.settingsService = settingsService;
    }
    range(start, end) {
        let arr = [];
        for (let i = start; i <= end; i++)
            arr.push(i);
        return arr;
    }
};
DiverComponent = __decorate([
    core_1.Component({
        selector: 'option-shortcuts-diver',
        templateUrl: 'app/option/shortcuts/diver/diver.component.html',
        styleUrls: ['app/option/shortcuts/diver/diver.component.css'],
        host: {}
    }),
    __metadata("design:paramtypes", [settings_service_1.SettingsService])
], DiverComponent);
exports.DiverComponent = DiverComponent;

//# sourceMappingURL=diver.component.js.map
