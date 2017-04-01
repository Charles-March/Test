import {Option} from "../../../../shared/settings/settings.service";
import {ShortCuts} from "../../../shortcuts/shortcuts";
import {DamageContainer} from "./damagecontainer";

export class DamageEstimator {

    private wGame: any | Window;
    private params: Option.VIP.General
    private shortcuts: ShortCuts;
    private damageContainer: DamageContainer;
    private events: any[];

    constructor(wGame: any, params: Option.VIP.General) {
        this.wGame = wGame;
        this.params = params;
        this.events = [];

        if (this.params.estimator) {

            console.log('start damageEstimator');

            this.shortcuts = new ShortCuts(this.wGame);
            this.damageContainer = new DamageContainer(this.wGame);

            //this.removeOnDeath();
            this.setSpellSelected();
            this.setSpellSlotDeselected();
            //this.stopOnFightEnd();

            this.damageContainer.toggle();
        }
    }


    private removeOnDeath(): void {
        let onDeath = (e: any) => {
            try {
                this.damageContainer.destroyEstimator(e.targetId);
            } catch (ex) {
                console.log(ex);
            }
        };

        this.wGame.gui.on('GameActionFightDeathMessage', onDeath);
        this.events.push(() => {
            this.wGame.gui.removeListener('GameActionFightDeathMessage', onDeath);
        });
    }

    private setSpellSlotDeselected(): void {

        let onSpellSlotDeselected = () => {
            try {
                console.log('onSpellSlotDeselected');
                this.damageContainer.destroyEstimators();
            } catch (ex) {
                console.log(ex);
            }
        };
        this.wGame.gui.on('spellSlotDeselected', onSpellSlotDeselected);
        this.events.push(() => {
            this.wGame.gui.removeListener('spellSlotSelected', onSpellSlotDeselected);
        });
    }

    private setSpellSelected(): void {
        let onSpellSelected = (spellId: number) => {
            try {
                console.log('onSpellSelected');
                let spell = this.wGame.gui.playerData.characters.mainCharacter.spellData.spells[spellId];
                this.damageContainer.display(spell);
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
                this.damageContainer.fightEnded();
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
        this.damageContainer.destroy();
        this.events.forEach((event) => {
            event();
        });
        this.events = [];
    }

}
