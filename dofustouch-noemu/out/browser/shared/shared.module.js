"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
const core_1 = require("@angular/core");
const settings_service_1 = require("./settings/settings.service");
const ipcrenderer_service_1 = require("./electron/ipcrenderer.service");
const application_service_1 = require("./electron/application.service");
let SharedModule = SharedModule_1 = class SharedModule {
    static forRoot() {
        return {
            ngModule: SharedModule_1,
            providers: [
                settings_service_1.SettingsService,
                ipcrenderer_service_1.IpcRendererService,
                application_service_1.ApplicationService,
                {
                    provide: core_1.APP_INITIALIZER,
                    useFactory: (config) => () => config.load(),
                    deps: [application_service_1.ApplicationService],
                    multi: true
                },
            ]
        };
    }
};
SharedModule = SharedModule_1 = __decorate([
    core_1.NgModule({})
], SharedModule);
exports.SharedModule = SharedModule;
var SharedModule_1;

//# sourceMappingURL=shared.module.js.map
