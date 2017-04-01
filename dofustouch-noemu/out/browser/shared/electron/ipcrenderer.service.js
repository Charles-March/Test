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
const { ipcRenderer } = global.nodeRequire('electron');
let IpcRendererService = class IpcRendererService {
    constructor(zone) {
        this.zone = zone;
        this.ipcRenderer = ipcRenderer;
        this.counter = 0;
    }
    on(message, callback) {
        return this.ipcRenderer.on(message, (event, args) => {
            // prevent that change is effectiv for zone.js because ipc run not under controll of zone.js
            this.zone.run(() => {
                callback(event, args);
            });
        });
    }
    send(message, ...args) {
        this.ipcRenderer.send(message, args);
    }
    sendSync(message, ...args) {
        return this.ipcRenderer.sendSync(message, args);
    }
};
IpcRendererService = __decorate([
    core_1.Injectable(),
    __metadata("design:paramtypes", [core_1.NgZone])
], IpcRendererService);
exports.IpcRendererService = IpcRendererService;

//# sourceMappingURL=ipcrenderer.service.js.map
