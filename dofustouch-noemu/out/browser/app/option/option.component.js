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
const ipcrenderer_service_1 = require("./../../shared/electron/ipcrenderer.service");
const platform_browser_1 = require("@angular/platform-browser");
let OptionComponent = class OptionComponent {
    constructor(ipcRendererService, titleService) {
        this.ipcRendererService = ipcRendererService;
        this.titleService = titleService;
        this.titleService.setTitle('Option');
    }
    validate() {
        console.log('emit->valite-option');
        this.ipcRendererService.send('validate-option');
    }
    reset() {
        console.log('emit->reset-option');
        this.ipcRendererService.send('reset-option');
    }
};
OptionComponent = __decorate([
    core_1.Component({
        selector: 'options',
        templateUrl: 'app/option/option.component.html',
        styleUrls: ['app/option/option.component.css'],
        host: {
            "style": "height:100%;" // find something less ugly in future
        }
    }),
    __metadata("design:paramtypes", [ipcrenderer_service_1.IpcRendererService,
        platform_browser_1.Title])
], OptionComponent);
exports.OptionComponent = OptionComponent;

//# sourceMappingURL=option.component.js.map
