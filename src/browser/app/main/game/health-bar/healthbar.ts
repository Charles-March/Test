import {Option} from "../../../../shared/settings/settings.service";
import {ShortCuts} from "../../../shortcuts/shortcuts";
import {BarContainer} from "./barcontainer";

export class HealthBar {

    private wGame: any | Window;
    private shortcuts: ShortCuts;
    private barContainer: BarContainer;
    private fightJustStarted: boolean = false;
    private events: any[];

    constructor(wGame: any, skipLogin: boolean = false) {
        this.wGame = wGame;
        this.events = [];
        this.shortcuts = new ShortCuts(this.wGame);
        this.barContainer = new BarContainer(this.wGame);

        this.removeOnDeath();
        this.setFightStart();
        this.displayOnStart();
        this.stopOnFightEnd();


        this.shortcuts.bind('p', () => {
            console.log('start health bar');
            this.barContainer.toggle();
        });
    }


    private removeOnDeath(): void {
        let onDeath = (e: any) => {
            this.barContainer.destroyBar(e.targetId);
        };

        this.wGame.gui.on('GameActionFightDeathMessage', onDeath);
        this.events.push(() => {
            this.wGame.gui.removeListener('GameActionFightDeathMessage', onDeath);
        });
    }

    private setFightStart(): void {
        let onFightStart = (e: any) => {
            this.fightJustStarted = true;
        };

        this.wGame.dofus.connectionManager.on('GameFightStartingMessage', onFightStart);
        this.events.push(() => {
            this.wGame.dofus.connectionManager.removeListener('GameFightStartingMessage', onFightStart);
        });
    }

    private displayOnStart(): void {
        let onNewRound = (e: any) => {
            if (this.fightJustStarted) {
                this.fightJustStarted = false;
                this.barContainer.fightStarted();
            }
        };

        this.wGame.dofus.connectionManager.on('GameFightNewRoundMessage', onNewRound);
        this.events.push(() => {
            this.wGame.dofus.connectionManager.removeListener('GameFightNewRoundMessage', onNewRound);
        });
    }

    private stopOnFightEnd(): void {
        let onFightEnd = (e: any) => {
            this.barContainer.fightEnded();
        };

        this.wGame.dofus.connectionManager.on('GameFightEndMessage', onFightEnd);
        this.events.push(() => {
            this.wGame.dofus.connectionManager.removeListener('GameFightEndMessage', onFightEnd);
        });
    }



    public reset() {
        this.events.forEach((event) => {
            event();
        });
        this.events = [];
    }

}
