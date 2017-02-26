import {
    Component, Input, Inject, NgZone, OnInit, AfterViewInit, Pipe, PipeTransform, Output,
    EventEmitter
} from '@angular/core';
import {Tab} from './../tab/tab';
import {ShortCuts} from './../../shortcuts/shortcuts';
import * as async from 'async';
import {IpcRendererService} from './../../../shared/electron/ipcrenderer.service';
import {TranslateService} from "ng2-translate";
import {SettingsService} from './../../../shared/settings/settings.service';
import {ApplicationService} from "./../../../shared/electron/application.service";
import {DomSanitizer, SafeUrl, Title} from "@angular/platform-browser";
import {AutoGroup} from "./auto-group/autogroup";
import {Inactivity} from "./general/inactivity";
import {HealthBar} from "./health-bar/healthbar";


const {remote} = (<any>global).nodeRequire('electron');

@Pipe({name: 'safe'})
export class SafePipe implements PipeTransform {
    constructor(private sanitizer: DomSanitizer) {
    }

    transform(url: string) {
        return this.sanitizer.bypassSecurityTrustResourceUrl(url);
    }
}

@Component({
    selector: 'game',
    templateUrl: 'app/main/game/game.component.html',
    styleUrls: ['app/main/game/game.component.css']
})
export class GameComponent implements OnInit, AfterViewInit {

    @Input() private tab: Tab;
    @Output() selectTab = new EventEmitter();
    private shortCuts: ShortCuts;
    private gamePath: string;
    private gameLoaded: boolean = false;
    private backupMaxZoom: number;
    private autogroup: AutoGroup;
    private inactivity: Inactivity;
    private healthbar : HealthBar;

    constructor(@Inject('Window') private window: Window,
                private ipcRendererService: IpcRendererService,
                private zone: NgZone,
                private settingsService: SettingsService,
                private translate: TranslateService,
                private applicationService: ApplicationService,
                private titleService: Title) {
        this.gamePath = this.applicationService.gamePath + '/index.html';

    }

    ngOnInit() {

    }

    ngAfterViewInit() {
        // after View Init get the iFrame
        this.tab.window = this.window['Frame' + this.tab.id].contentWindow;
        this.shortCuts = new ShortCuts(this.tab.window);
    }

    private gameReady(): void {

        if (this.gameLoaded) {
            this.setEventListener();
            this.setMod();
        }

        this.gameLoaded = true;
    }


    private setMod(): void{

        if (this.applicationService.vipStatus >= 2) {
            this.autogroup = new AutoGroup(this.tab.window, this.settingsService.option.vip.autogroup);
            this.inactivity = new Inactivity(this.tab.window, this.settingsService.option.vip.general.disable_inactivity)
            this.healthbar = new HealthBar(this.tab.window);
        }

        this.ipcRendererService.on('reload-settings-done', () => {

            if (this.applicationService.vipStatus >= 2) {
                /* Reset mod */
                this.autogroup.reset();
                this.inactivity.reset();


                /* bind again */
                this.inactivity = new Inactivity(this.tab.window, this.settingsService.option.vip.general.disable_inactivity);

                if (this.tab.isLogged)
                    this.autogroup = new AutoGroup(this.tab.window, this.settingsService.option.vip.autogroup, true);
                else
                    this.autogroup = new AutoGroup(this.tab.window, this.settingsService.option.vip.autogroup, false);

                if(this.applicationService.vipStatus >= 3){
                    this.healthbar.reset();

                    /* bind again */
                    this.healthbar = new HealthBar(this.tab.window);
                }
            }
        });
    }

    private setEventListener(): void {

        // event -> resize window game
        this.tab.window.onresize = () => {
            this.tab.window.gui._resizeUi();
            this.checkMaxZoom();
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
            this.unBindShortcuts();
            this.zone.run(() => {
                this.tab.isLogged = false;
                this.tab.character = null;
            });
        });

        // event -> electron ask for reload setting
        this.ipcRendererService.on('reload-shortcuts', (event: any, arg: any) => {
            if (this.tab.isLogged) {
                console.log('receive->reload-shortcuts');

                // unbind all registered shortcuts
                this.unBindShortcuts();

                // re-bind new shortcuts
                this.bindShortcuts();
            }
        });

        this.tab.window.isoEngine.mapScene._refreshAreasBackup = this.tab.window.isoEngine.mapScene._refreshAreas;
        this.tab.window.isoEngine.mapScene._refreshAreas = function () {
            for (var id in this.areasToRefresh) {
                if (this.areasToRefresh[id][3] < this.t) {
                    this.areasToRefresh[id][2] = this.t;
                    this.areasToRefresh[id][3] = this.t + 5;
                }
            }
            this._refreshAreasBackup();
        }
    }

    private sendMPNotif(msg: any) {
        if (!this.tab.window.document.hasFocus() && this.settingsService.option.notification.private_message) {
            if (msg.channel == 9) {

                this.zone.run(() => {
                    this.tab.notification = true;
                });

                let mpNotif = new Notification(this.translate.instant('app.notifications.private-message', {character: msg.senderName}), {
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

    private sendFightTurnNotif(actor: any) {
        if (!this.tab.window.document.hasFocus()
            && this.settingsService.option.notification.fight_turn
            && this.tab.window.gui.playerData.characterBaseInformations.id == actor.id) {


            this.zone.run(() => {
                this.tab.notification = true;
            });

            let turnNotif = new Notification(this.translate.instant('app.notifications.fight-turn', {character: this.tab.window.gui.playerData.characterBaseInformations.name}));

            turnNotif.onclick = () => {
                remote.getCurrentWindow().focus();
                this.zone.run(() => {
                    this.selectTab.emit(this.tab);
                });
            };
        }
    }

    private sendTaxCollectorNotif(tc: any) {
        if (!this.tab.window.document.hasFocus() && this.settingsService.option.notification.tax_collector) {

            let guildName = tc.guild.guildName;
            let x = tc.worldX;
            let y = tc.worldY;
            let zoneName = tc.enrichData.subAreaName;
            let tcName = tc.enrichData.firstName + " " + tc.enrichData.lastName;

            let mpNotif = new Notification(this.translate.instant('app.notifications.tax-collector'), {
                body: zoneName + ' [' + x + ', ' + y + '] : ' + guildName + ', ' + tcName
            });

            mpNotif.onclick = () => {
                remote.getCurrentWindow().focus();
                this.zone.run(() => {
                    this.selectTab.emit(this.tab);
                });
            };

        }
    }

    private checkMaxZoom() {
        if (!this.backupMaxZoom) this.backupMaxZoom = this.tab.window.isoEngine.mapScene.camera.maxZoom;
        this.tab.window.isoEngine.mapScene.camera.maxZoom = Math.max(
            this.backupMaxZoom,
            this.backupMaxZoom + (this.tab.window.isoEngine.mapScene.canvas.height / 800 - 1)
        );
    }

    private bindEventIG(): void {
        let onChatServerMessage = (msg: any) => {
            this.sendMPNotif(msg);
        };
        let onGameFightTurnStartMessage = (actor: any) => {
            this.sendFightTurnNotif(actor);
        }
        let onTaxCollectorAttackedMessage = (tc: any) => {
            this.sendTaxCollectorNotif(tc);
        };

        this.tab.window.dofus.connectionManager.on('ChatServerMessage', onChatServerMessage);
        this.tab.window.gui.on('GameFightTurnStartMessage', onGameFightTurnStartMessage);
        this.tab.window.dofus.connectionManager.on('TaxCollectorAttackedMessage', onTaxCollectorAttackedMessage);

        this.tab.window.gui.on("disconnect", () => {
            this.tab.window.dofus.connectionManager.removeListener('ChatServerMessage', onChatServerMessage);
            this.tab.window.gui.removeListener('GameFightTurnStartMessage', onGameFightTurnStartMessage);
            this.tab.window.dofus.connectionManager.removeListener('TaxCollectorAttackedMessage', onTaxCollectorAttackedMessage);
        });

        this.checkMaxZoom();
    }

    private unBindShortcuts(): void {
        this.shortCuts.unBindAll();
    }

    private bindShortcuts(): void {

        // end turn
        this.shortCuts.bind(this.settingsService.option.shortcuts.diver.end_turn, () => {
            this.tab.window.gui.fightManager.finishTurn()
        });

        // open chat
        this.shortCuts.bind(this.settingsService.option.shortcuts.diver.open_chat, () => {
            this.tab.window.gui.chat.activate()
        });

        // spell
        async.forEachOf(this.settingsService.option.shortcuts.spell, (shortcut: string, index: number) => {
            this.shortCuts.bind(shortcut, () => {
                this.tab.window.gui.shortcutBar._panels.spell.slotList[index].tap();
                //this.tab.window.gui.shortcutBar.panels.spell.slotList[index].tap();
            });
        });

        // item
        async.forEachOf(this.settingsService.option.shortcuts.item, (shortcut: string, index: number) => {
            this.shortCuts.bind(shortcut, () => {
                //this.tab.window.gui.shortcutBar.panels.item.slotList[index].tap();
                this.tab.window.gui.shortcutBar._panels.item.slotList[index].tap();
            });
        });

        // interfaces
        async.forEachOf(this.settingsService.option.shortcuts.interface.getAll(), (inter: any) => {
            this.tab.window.gui.menuBar._icons._childrenList.forEach((element: any, index: number) => {
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
}
