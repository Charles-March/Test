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
const router_1 = require("@angular/router");
const ipcrenderer_service_1 = require("./../../shared/electron/ipcrenderer.service");
const platform_browser_1 = require("@angular/platform-browser");
const progress = global.nodeRequire('request-progress');
const request = global.nodeRequire('request');
const fs = global.nodeRequire('fs');
let UpdateComponent = class UpdateComponent {
    constructor(route, router, zone, ipcRendererService, titleService) {
        this.route = route;
        this.router = router;
        this.zone = zone;
        this.ipcRendererService = ipcRendererService;
        this.titleService = titleService;
        this.progress = 0;
        this.informations = 'Début du téléchargement...';
        this.titleService.setTitle('Mise à jours');
    }
    download() {
        progress(request(this.remoteUrl), {})
            .on('progress', (state) => {
            this.zone.run(() => {
                this.progress = Math.round(state.percent * 100);
                this.informations = this.formatUnit(state.size.transferred) + ' / ' + this.formatUnit(state.size.total);
            });
        })
            .on('error', (err) => {
            console.log(err);
            this.zone.run(() => {
                this.informations = '<span class="text-error">Impossible de télécharger la mise à jour ! Veuillez réessayer ultérieurement</span>';
            });
        })
            .on('end', () => {
            this.zone.run(() => {
                this.progress = 100;
            });
        })
            .pipe(this.saveFile);
        this.saveFile.addListener('finish', () => {
            this.zone.run(() => {
                this.install();
            });
        });
    }
    install() {
        this.informations = 'Installation de la mis à jour...';
        // call electron to install the update
        this.ipcRendererService.send('install-update');
    }
    formatUnit(count) {
        if (count >= 1000000) {
            return (Math.round((count / 1000000) * 100) / 100) + ' Mb';
        }
        else if (count >= 1000) {
            return (Math.round((count / 1000) * 100) / 100) + ' Kb';
        }
        else {
            return (Math.round(count * 100) / 100) + ' B';
        }
    }
    ngOnInit() {
        this.sub = this.route.params.subscribe(params => {
            // Defaults to 0 if no query param provided.
            this.savePath = decodeURIComponent(params['savePath']);
            this.remoteUrl = decodeURIComponent(params['remoteUrl']);
            this.saveFile = fs.createWriteStream(this.savePath);
            this.download();
        });
    }
    ngOnDestroy() {
        this.sub.unsubscribe();
    }
};
UpdateComponent = __decorate([
    core_1.Component({
        moduleId: module.id,
        selector: 'update',
        templateUrl: 'update.component.html',
        styleUrls: ['update.component.css']
    }),
    __metadata("design:paramtypes", [router_1.ActivatedRoute,
        router_1.Router,
        core_1.NgZone,
        ipcrenderer_service_1.IpcRendererService,
        platform_browser_1.Title])
], UpdateComponent);
exports.UpdateComponent = UpdateComponent;

//# sourceMappingURL=update.component.js.map
