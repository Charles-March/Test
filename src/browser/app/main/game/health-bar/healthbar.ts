import {Option} from "../../../../shared/settings/settings.service";
import {ShortCuts} from "../../../shortcuts/shortcuts";
import {BarContainer} from "./barcontainer";

export class HealthBar {

    private wGame: any | Window;
    private params: Option.VIP.General
    private shortcuts: ShortCuts;
    private barContainer: BarContainer;
    private fightJustStarted: boolean = false;
    private events: any[];

    constructor(wGame: any, params: Option.VIP.General, skipLogin: boolean = false) {
        this.wGame = wGame;
        this.params = params;
        this.events = [];

        if (this.params.health_bar) {

            console.log('start healthbar');

            this.shortcuts = new ShortCuts(this.wGame);
            this.barContainer = new BarContainer(this.wGame);

            this.removeOnDeath();
            this.setFightStart();
            this.displayOnStart();
            this.stopOnFightEnd();


            this.shortcuts.bind(this.params.health_bar_shortcut, () => {
                console.log('start health bar');
                this.barContainer.toggle();
            });
        }
    }


    private removeOnDeath(): void {
        let onDeath = (e: any) => {
            try {
                this.barContainer.destroyBar(e.targetId);
            } catch (ex) {
                console.log(ex);
            }
        };

        this.wGame.gui.on('GameActionFightDeathMessage', onDeath);
        this.events.push(() => {
            this.wGame.gui.removeListener('GameActionFightDeathMessage', onDeath);
        });
    }

    private setFightStart(): void {
        let onFightStart = (e: any) => {
            try {
                this.fightJustStarted = true;
            } catch (ex) {
                console.log(ex);
            }
        };

        this.wGame.dofus.connectionManager.on('GameFightStartingMessage', onFightStart);
        this.events.push(() => {
            this.wGame.dofus.connectionManager.removeListener('GameFightStartingMessage', onFightStart);
        });
    }

    private displayOnStart(): void {
        let onNewRound = (e: any) => {
            try {
                if (this.fightJustStarted) {
                    this.fightJustStarted = false;
                    this.barContainer.fightStarted();
                }
            } catch (ex) {
                console.log(ex);
            }
        };

        this.wGame.dofus.connectionManager.on('GameFightNewRoundMessage', onNewRound);
        this.events.push(() => {
            this.wGame.dofus.connectionManager.removeListener('GameFightNewRoundMessage', onNewRound);
        });
    }

    private stopOnFightEnd(): void {
        let onFightEnd = (e: any) => {
            try {
                this.barContainer.fightEnded();
            } catch (ex) {
                console.log(ex);
            }
        };

        this.wGame.dofus.connectionManager.on('GameFightEndMessage', onFightEnd);
        this.events.push(() => {
            this.wGame.dofus.connectionManager.removeListener('GameFightEndMessage', onFightEnd);
        });
    }


    public reset() {
        this.shortcuts.unBindAll();
        this.barContainer.destroy();
        this.events.forEach((event) => {
            event();
        });
        this.events = [];
    }

}
