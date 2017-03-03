import {Option} from "../../../../shared/settings/settings.service";
import {ShortCuts} from "../../../shortcuts/shortcuts";
import {DamageContainer} from "./damagecontainer";

export class DamageEstimator {

    private wGame: any | Window;
    private params: Option.VIP.General
    private shortcuts: ShortCuts;
    private barContainer: DamageContainer;
    private fightJustStarted: boolean = false;
    private events: any[];

    constructor(wGame: any, params: Option.VIP.General) {
        this.wGame = wGame;
        this.params = params;
        this.events = [];

        if (this.params.health_bar) {

            console.log('start damageEstimator');

            this.shortcuts = new ShortCuts(this.wGame);
            this.barContainer = new DamageContainer(this.wGame);

            this.removeOnDeath();
            this.setSpellSelected();
            this.stopOnFightEnd();


            this.shortcuts.bind(this.params.health_bar_shortcut, () => {
                console.log('start damage estimator');
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

    private setSpellSelected(): void {
        let onSpellSelected = (spellId: number) => {
            try {
                let spell = this.wGame.gui.playerData.characters.mainCharacter.spellData.spells[spellId];
                this.barContainer.display(spell);
            } catch (ex) {
                console.log(ex);
            }
        };
        this.wGame.gui.on('spellSlotSelected', onSpellSelected);
        this.events.push(() => {
            this.wGame.gui.removeListener('spellSlotSelected', onSpellSelected);
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
