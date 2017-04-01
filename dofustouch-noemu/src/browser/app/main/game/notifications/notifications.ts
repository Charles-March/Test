import {Option} from "../../../../shared/settings/settings.service";
import {NgZone} from '@angular/core';
import {TranslateService} from 'ng2-translate';
import {Tab} from "../../tab/tab";
import {Observable} from 'rxjs/Observable';
import {BehaviorSubject} from 'rxjs/BehaviorSubject';
import {EventEmitter} from 'eventemitter3';


const {remote} = (<any>global).nodeRequire('electron');

export class Notifications extends EventEmitter {

    private wGame: any | Window;
    private params: Option.Notification;
    private translate: TranslateService;
    private events: any[] = [];
    private tab: Tab;

    constructor(wGame: any, tab: Tab, params: Option.Notification, translate: TranslateService){
        super();
        this.wGame = wGame;
        this.params = params;
        this.translate = translate;
        this.tab = tab;

        let onCharacterSelectedSuccess = () => {
            let onChatServerMessage = (msg: any) => {
                this.sendMPNotif(msg);
            };
            let onGameFightTurnStartMessage = (actor: any) => {
                this.sendFightTurnNotif(actor);
            };
            let onTaxCollectorAttackedMessage = (tc: any) => {
                this.sendTaxCollectorNotif(tc);
            };

            let onGameRolePlayArenaFightPropositionMessage = (tc: any) => {
                this.sendKolizeumNotif(tc);
            };

            this.wGame.dofus.connectionManager.on('ChatServerMessage', onChatServerMessage);
            this.wGame.gui.on('GameFightTurnStartMessage', onGameFightTurnStartMessage);
            this.wGame.dofus.connectionManager.on('TaxCollectorAttackedMessage', onTaxCollectorAttackedMessage);
            this.wGame.dofus.connectionManager.on('GameRolePlayArenaFightPropositionMessage', onGameRolePlayArenaFightPropositionMessage);

            let onDisconnect = () => {
                this.wGame.dofus.connectionManager.removeListener('ChatServerMessage', onChatServerMessage);
                this.wGame.gui.removeListener('GameFightTurnStartMessage', onGameFightTurnStartMessage);
                this.wGame.dofus.connectionManager.removeListener('TaxCollectorAttackedMessage', onTaxCollectorAttackedMessage);
                this.wGame.dofus.connectionManager.removeListener('GameRolePlayArenaFightPropositionMessage', onGameRolePlayArenaFightPropositionMessage);
            };

            this.wGame.gui.on("disconnect", onDisconnect);
            this.events.push(() => {
                onDisconnect();
                this.wGame.gui.removeListener("disconnect", onDisconnect);
            });
        };

        // Bind event when player go IG
        this.wGame.gui.playerData.on("characterSelectedSuccess", onCharacterSelectedSuccess);
        this.events.push(() => {
            this.wGame.gui.playerData.removeListener("characterSelectedSuccess", onCharacterSelectedSuccess);
        });

        if(this.wGame.gui.isConnected){
            onCharacterSelectedSuccess();
        }
    }


    public reset() {
        this.events.forEach((event) => {
            event();
        });
        this.events = [];
    }

    private sendMPNotif(msg: any) {
        if (!this.wGame.document.hasFocus() && this.params.private_message) {
            if (msg.channel == 9) {

                this.emit('newNotification');

                let mpNotif = new Notification(this.translate.instant('app.notifications.private-message', {character: msg.senderName}), {
                    body: msg.content
                });

                mpNotif.onclick = () => {
                    remote.getCurrentWindow().focus();
                    this.emit('focusTab');
                };
            }
        }
    }

    private sendFightTurnNotif(actor: any) {
        if (!this.wGame.document.hasFocus()
            && this.params.fight_turn
            && this.wGame.gui.playerData.characterBaseInformations.id == actor.id) {

            this.emit('newNotification');

            let turnNotif = new Notification(this.translate.instant('app.notifications.fight-turn', {character: this.wGame.gui.playerData.characterBaseInformations.name}));

            turnNotif.onclick = () => {
                remote.getCurrentWindow().focus();
                this.emit('focusTab');
            };
        }
    }

    private sendKolizeumNotif(msg: any) {
        if (!this.wGame.document.hasFocus()
            && this.params.fight_turn) {

            this.emit('newNotification');

            let kolizeumNotif = new Notification(this.translate.instant('app.notifications.kolizeum'));

            kolizeumNotif.onclick = () => {
                remote.getCurrentWindow().focus();
                this.emit('focusTab');
            };
        }
    }

    private sendTaxCollectorNotif(tc: any) {
        if (!this.wGame.document.hasFocus() && this.params.tax_collector) {

            this.emit('newNotification');

            let guildName = tc.guild.guildName;
            let x = tc.worldX;
            let y = tc.worldY;
            let zoneName = tc.enrichData.subAreaName;
            let tcName = tc.enrichData.firstName + " " + tc.enrichData.lastName;

            let taxCollectorNotif = new Notification(this.translate.instant('app.notifications.tax-collector'), {
                body: zoneName + ' [' + x + ', ' + y + '] : ' + guildName + ', ' + tcName
            });

            taxCollectorNotif.onclick = () => {
                remote.getCurrentWindow().focus();
                this.emit('focusTab');
            };

        }
    }
}