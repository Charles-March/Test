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
const platform_browser_1 = require("@angular/platform-browser");
const application_service_1 = require("../../shared/electron/application.service");
const marked = require('marked');
const fs = global.nodeRequire('fs');
let ChangeLogComponent = class ChangeLogComponent {
    constructor(titleService, applicationService, zone) {
        this.titleService = titleService;
        this.applicationService = applicationService;
        this.zone = zone;
        this.titleService.setTitle('ChangeLog');
    }
    ngOnInit() {
        console.log(this.applicationService.appPath);
        fs.readFile(this.applicationService.appPath + '/CHANGELOG.md', { encoding: 'utf-8' }, (err, data) => {
            this.zone.run(() => {
                this.content = marked(data);
            });
        });
    }
};
ChangeLogComponent = __decorate([
    core_1.Component({
        moduleId: module.id,
        selector: 'changelog',
        templateUrl: 'changelog.component.html',
        styleUrls: ['changelog.component.css']
    }),
    __metadata("design:paramtypes", [platform_browser_1.Title,
        application_service_1.ApplicationService,
        core_1.NgZone])
], ChangeLogComponent);
exports.ChangeLogComponent = ChangeLogComponent;

//# sourceMappingURL=changelog.component.js.map
