import {
    Component, Input, Inject, NgZone, OnInit, AfterViewInit, Pipe, PipeTransform, Output,
    EventEmitter
} from '@angular/core';
import {Tab} from './../tab/tab';
import {Shortcuts} from './shortcuts/shortcuts';
import * as async from 'async';
import {IpcRendererService} from './../../../shared/electron/ipcrenderer.service';
import {TranslateService} from "ng2-translate";
import {SettingsService} from './../../../shared/settings/settings.service';
import {ApplicationService} from "./../../../shared/electron/application.service";
import {DomSanitizer, SafeUrl, Title} from "@angular/platform-browser";
import {AutoGroup} from "./auto-group/autogroup";
import {Inactivity} from "./general/inactivity";
import {HealthBar} from "./health-bar/healthbar";
import {Notifications} from "./notifications/notifications";
import {DamageEstimator} from "./damage-estimator/damageestimator";


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
    private shortcuts: Shortcuts;
    private gamePath: string;
    private gameLoaded: boolean = false;
    private backupMaxZoom: number;
    private autogroup: AutoGroup;
    private inactivity: Inactivity;
    private healthbar: HealthBar;
    private damageEstimator: DamageEstimator;
    private notifications: Notifications;

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
    }

    private gameReady(): void {

        if (this.gameLoaded) {
            //this.tab.window.gui.loginScreen._login("username", "password", false);
            this.setEventListener();

            this.setMods();

            // If the tab has credentials, connect the account
            // Then delete credentials
            if (this.tab.credentials) {
                this.connectAccount();
                delete(this.tab.credentials);
            }

            this.ipcRendererService.on('reload-settings-done', () => {
                this.reloadMods();
            });
        }

        this.gameLoaded = true;
    }

    private reloadMods(): void {
        switch (this.applicationService.vipStatus) {
            case 5:
            case 4:
            case 3:
                this.healthbar.reset();
            case 2:
                this.autogroup.reset();
                this.inactivity.reset();
            default:
                this.notifications.removeAllListeners();
                this.notifications.reset();
                this.shortcuts.reset();
        }

        this.setMods();
    }

    private setMods(): void {

        switch (this.applicationService.vipStatus) {
            case 5:
            case 4:
            case 3:
                this.healthbar = new HealthBar(this.tab.window, this.settingsService.option.vip.general);
            case 2:
                this.autogroup = new AutoGroup(this.tab.window, this.settingsService.option.vip.autogroup);
                this.inactivity = new Inactivity(this.tab.window, this.settingsService.option.vip.general.disable_inactivity);
                this.damageEstimator = new DamageEstimator(this.tab.window, this.settingsService.option.vip.general);
            default:
                this.notifications = new Notifications(this.tab.window, this.tab, this.settingsService.option.notification, this.translate);
                this.notifications.on('newNotification', () => {
                    this.zone.run(() => {
                        this.tab.notification = true;
                    });
                });
                this.notifications.on('focusTab', () => {

                    this.zone.run(() => {
                        this.selectTab.emit(this.tab);
                    });
                });
                this.shortcuts = new Shortcuts(this.tab.window, this.settingsService.option.shortcuts);
        }
    }

    private setEventListener(): void {

        var canvas = this.tab.window.document.getElementById("mapScene-canvas");
        canvas.addEventListener("webglcontextlost", (event:any) => {
            console.log('reload webglcontext cause: webglcontextlost');
            this.tab.window.isoEngine.background.render()
            event.preventDefault();
        }, false);

        // event -> resize window game
        this.tab.window.onresize = () => {
            this.tab.window.gui._resizeUi();
            this.checkMaxZoom();
        };

        let onCharacterSelectedSuccess = () =>{
            // retrieve character name and update zone.js
            this.zone.run(() => {
                this.tab.character = this.tab.window.gui.playerData.characterBaseInformations.name;
                this.tab.isLogged = true;
                this.titleService.setTitle(this.tab.character);
            });

            this.checkMaxZoom();
        };

        let onDisconnect = () => {
            this.zone.run(() => {
                this.tab.isLogged = false;
                this.tab.character = null;
            });
        }

        this.tab.window.gui.playerData.on("characterSelectedSuccess", onCharacterSelectedSuccess);
        this.tab.window.gui.on("disconnect", onDisconnect);

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

    private checkMaxZoom() {
        if (!this.backupMaxZoom) this.backupMaxZoom = this.tab.window.isoEngine.mapScene.camera.maxZoom;
        this.tab.window.isoEngine.mapScene.camera.maxZoom = Math.max(
            this.backupMaxZoom,
            this.backupMaxZoom + (this.tab.window.isoEngine.mapScene.canvas.height / 800 - 1)
        );
    }

    // Connect the account to the last character connected
    private connectAccount() {
        this.tab.window.gui.loginScreen._connectMethod = "lastCharacter";
        let credentials = this.tab.credentials;
        this.tab.window.gui.loginScreen._login(credentials.account_name, credentials.password, false);
    }
}
