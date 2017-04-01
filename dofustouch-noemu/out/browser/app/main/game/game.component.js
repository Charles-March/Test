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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
const core_1 = require("@angular/core");
const tab_1 = require("./../tab/tab");
const shortcuts_1 = require("./../../shortcuts/shortcuts");
const async = require("async");
const ipcrenderer_service_1 = require("./../../../shared/electron/ipcrenderer.service");
const settings_service_1 = require("./../../../shared/settings/settings.service");
const application_service_1 = require("./../../../shared/electron/application.service");
const platform_browser_1 = require("@angular/platform-browser");
const { remote } = global.nodeRequire('electron');
let SafePipe = class SafePipe {
    constructor(sanitizer) {
        this.sanitizer = sanitizer;
    }
    transform(url) {
        return this.sanitizer.bypassSecurityTrustResourceUrl(url);
    }
};
SafePipe = __decorate([
    core_1.Pipe({ name: 'safe' }),
    __metadata("design:paramtypes", [platform_browser_1.DomSanitizer])
], SafePipe);
exports.SafePipe = SafePipe;
let GameComponent = class GameComponent {
    constructor(window, ipcRendererService, zone, settingsService, applicationService, titleService) {
        this.window = window;
        this.ipcRendererService = ipcRendererService;
        this.zone = zone;
        this.settingsService = settingsService;
        this.applicationService = applicationService;
        this.titleService = titleService;
        this.selectTab = new core_1.EventEmitter();
        this.gameLoaded = false;
        this.gamePath = this.applicationService.gamePath + '/index.html';
    }
    ngOnInit() {
    }
    ngAfterViewInit() {
        // after View Init get the iFrame
        this.tab.window = this.window['Frame' + this.tab.id].contentWindow;
        this.shortCuts = new shortcuts_1.ShortCuts(this.tab.window);
    }
    gameReady() {
        if (this.gameLoaded) {
            this.setEventListener();
        }
        this.gameLoaded = true;
    }
    setEventListener() {
        // event -> resize window game
        this.tab.window.onresize = () => {
            this.tab.window.gui._resizeUi();
        };
        // event -> log into the world
        this.tab.window.gui.playerData.on("characterSelectedSuccess", () => {
            // retrieve character name and update zone.js
            this.zone.run(() => {
                this.tab.character = this.tab.window.gui.playerData.characterBaseInformations.name;
                this.tab.isLogged = true;
                this.titleService.setTitle(this.tab.character);
            });
            // bind event IG
            this.bindEventIG();
            // bind shortcut
            this.bindShortcuts();
        });
        this.tab.window.gui.on("disconnect", () => {
            this.unBindEventIG();
            //this.
            this.zone.run(() => {
                this.tab.isLogged = false;
                this.tab.character = null;
            });
        });
        // event -> electron ask for reload setting
        this.ipcRendererService.on('reload-shortcuts', (event, arg) => {
            if (this.tab.isLogged) {
                console.log('receive->reload-shortcuts');
                // unbind all registered shortcuts
                this.unBindShortcuts();
                // re-bind new shortcuts
                this.bindShortcuts();
            }
        });
    }
    sendMPNotif(msg) {
        if (!this.tab.window.document.hasFocus() && this.settingsService.option.notification.private_message) {
            if (msg.channel == 9) {
                this.zone.run(() => {
                    this.tab.notification = true;
                });
                let mpNotif = new Notification('Message de : ' + msg.senderName, {
                    body: msg.content
                });
                mpNotif.onclick = () => {
                    remote.getCurrentWindow().focus();
                    this.zone.run(() => {
                        this.selectTab.emit(this.tab);
                    });
                };
            }
        }
    }
    sendFightTurnNotif(actor) {
        if (!this.tab.window.document.hasFocus()
            && this.settingsService.option.notification.fight_turn
            && this.tab.window.gui.playerData.characterBaseInformations.id == actor.id) {
            this.zone.run(() => {
                this.tab.notification = true;
            });
            let turnNotif = new Notification('Début du tour de ' + this.tab.window.gui.playerData.characterBaseInformations.name);
            turnNotif.onclick = () => {
                remote.getCurrentWindow().focus();
                this.zone.run(() => {
                    this.selectTab.emit(this.tab);
                });
            };
        }
    }
    bindEventIG() {
        this.tab.window.dofus.connectionManager.on('ChatServerMessage', (msg) => {
            this.sendMPNotif(msg);
        });
        this.tab.window.gui.eventHandlers.GameFightTurnStartMessage.push((actor) => {
            this.sendFightTurnNotif(actor);
        });
        /*(<any>this.tab.window).gui.on('GameFightTurnStartMessage', (actor: any) => {
         this.sendFightTurnNotif(actor)
         });*/
    }
    unBindEventIG() {
        this.tab.window.dofus.connectionManager.removeListener('ChatServerMessage', (msg) => {
            this.sendMPNotif(msg);
        });
        //(<any>this.tab.window).gui.removeListener('GameFightTurnStartMessage', this.sendFightTurnNotif);
        this.tab.window.gui.eventHandlers.GameFightTurnStartMessage.splice(this.tab.window.gui.eventHandlers.GameFightTurnStartMessage.indexOf((actor) => {
            this.sendFightTurnNotif(actor);
        }), 1);
    }
    unBindShortcuts() {
        this.shortCuts.unBindAll();
    }
    bindShortcuts() {
        // end turn
        this.shortCuts.bind(this.settingsService.option.shortcuts.diver.end_turn, () => {
            this.tab.window.gui.fightManager.finishTurn();
        });
        // spell
        async.forEachOf(this.settingsService.option.shortcuts.spell, (shortcut, index) => {
            this.shortCuts.bind(shortcut, () => {
                this.tab.window.gui.shortcutBar._panels.spell.slotList[index].tap();
                //(<any>this.tab.window).gui.shortcutBar.panels.spell.slotList[index].tap();
            });
        });
        // item
        async.forEachOf(this.settingsService.option.shortcuts.item, (shortcut, index) => {
            this.shortCuts.bind(shortcut, () => {
                //(<any>this.tab.window).gui.shortcutBar.panels.item.slotList[index].tap();
                this.tab.window.gui.shortcutBar._panels.item.slotList[index].tap();
            });
        });
        // interfaces
        async.forEachOf(this.settingsService.option.shortcuts.interface.getAll(), (inter) => {
            this.tab.window.gui.menuBar._icons._childrenList.forEach((element, index) => {
                if (element.id.toUpperCase() == inter.key.toUpperCase()) {
                    this.shortCuts.bind(inter.value, () => {
                        let newIndex = index;
                        this.tab.window.gui.menuBar._icons._childrenList[newIndex].tap();
                    });
                    return;
                }
            });
        });
    }
};
__decorate([
    core_1.Input(),
    __metadata("design:type", tab_1.Tab)
], GameComponent.prototype, "tab", void 0);
__decorate([
    core_1.Output(),
    __metadata("design:type", Object)
], GameComponent.prototype, "selectTab", void 0);
GameComponent = __decorate([
    core_1.Component({
        selector: 'game',
        templateUrl: 'app/main/game/game.component.html',
        styleUrls: ['app/main/game/game.component.css']
    }),
    __param(0, core_1.Inject('Window')),
    __metadata("design:paramtypes", [Window,
        ipcrenderer_service_1.IpcRendererService,
        core_1.NgZone,
        settings_service_1.SettingsService,
        application_service_1.ApplicationService,
        platform_browser_1.Title])
], GameComponent);
exports.GameComponent = GameComponent;

//# sourceMappingURL=game.component.js.map
