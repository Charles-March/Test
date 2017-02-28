import {Option} from "../../../../shared/settings/settings.service";
import {NgZone} from '@angular/core';
import {TranslateService} from 'ng2-translate';
import {Tab} from "../../tab/tab";
import * as async from 'async';
import {ShortCuts} from "../../../shortcuts/shortcuts";

export class Shortcuts {

    private wGame: any | Window;
    private params: Option.Shortcuts;
    private shortcuts: ShortCuts;
    private events: any[] = [];


    constructor(wGame: any, params: Option.Shortcuts){
        this.wGame = wGame;
        this.params = params;
        this.shortcuts = new ShortCuts(this.wGame);

        let onCharacterSelectedSuccess = () => {
            this.bindAll();

            let onDisconnect = () => {
                this.shortcuts.unBindAll();
            };

            this.wGame.gui.on("disconnect", onDisconnect);
            this.events.push(() => {
                this.wGame.gui.removeListener("disconnect", onDisconnect);
            });
        };

        this.wGame.gui.playerData.on("characterSelectedSuccess", onCharacterSelectedSuccess);
        this.events.push(() => {
            this.wGame.gui.playerData.removeListener("characterSelectedSuccess", onCharacterSelectedSuccess);
        });

        if(this.wGame.gui.isConnected){
            onCharacterSelectedSuccess();
        }
    }

    private bindAll(){

        // end turn
        this.shortcuts.bind(this.params.diver.end_turn, () => {
            this.wGame.gui.fightManager.finishTurn()
        });

        // open chat
        this.shortcuts.bind(this.params.diver.open_chat, () => {
            this.wGame.gui.chat.activate()
        });

        // spell
        async.forEachOf(this.params.spell, (shortcut: string, index: number) => {
            this.shortcuts.bind(shortcut, () => {
                this.wGame.gui.shortcutBar._panels.spell.slotList[index].tap();
                //this.tab.window.gui.shortcutBar.panels.spell.slotList[index].tap();
            });
        });

        // item
        async.forEachOf(this.params.item, (shortcut: string, index: number) => {
            this.shortcuts.bind(shortcut, () => {
                //this.tab.window.gui.shortcutBar.panels.item.slotList[index].tap();
                this.wGame.gui.shortcutBar._panels.item.slotList[index].tap();
            });
        });

        // interfaces
        async.forEachOf(this.params.interface.getAll(), (inter: any) => {
            this.wGame.gui.menuBar._icons._childrenList.forEach((element: any, index: number) => {
                if (element.id.toUpperCase() == inter.key.toUpperCase()) {
                    this.shortcuts.bind(inter.value, () => {
                        let newIndex = index;
                        this.wGame.gui.menuBar._icons._childrenList[newIndex].tap();
                    });
                    return;
                }
            });
        });
    }


    public reset() {
        this.shortcuts.unBindAll();

        this.events.forEach((event) => {
            event();
        });
        this.events = [];
    }


}