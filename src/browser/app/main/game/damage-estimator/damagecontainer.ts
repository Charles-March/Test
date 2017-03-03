import {Estimator} from "./estimator";
export class DamageContainer {

    private wGame: any | Window;
    private container: HTMLDivElement;
    private displayed: boolean = false;
    private enabled: boolean = true;
    private isInFight = false;
    private updateInterval: NodeJS.Timer;
    private bars: { [fighterId: number]: Estimator; } = { };

    constructor(wGame: Window | any) {
        this.wGame = wGame;

        this.container = document.createElement('div');
        this.container.id = 'damage-estimator';
        this.container.style.position = 'absolute';
        this.container.style.top = '0';
        this.container.style.left = '0';
        this.container.style.zIndex = '1';
        this.container.style.pointerEvents = 'none';
        this.container.style.visibility = 'hidden';

        this.wGame.foreground.rootElement.appendChild(this.container);

    }

    public toggle() {
        this.enabled = !this.enabled;
    }

    private show(spell:any) {
        if (!this.displayed) {
            this.displayed = true;
            this.container.style.visibility = 'visible';

            let fighters = this.wGame.gui.fightManager.getFighters();
            for (let index in fighters) {
                let fighter = this.wGame.gui.fightManager.getFighter(fighters[index]);
                if (fighter.data.alive && fighter.id != this.wGame.gui.playerData.characters.mainCharacterId) {
                    this.bars[fighter.id] = new Estimator(fighter, spell, this.wGame);
                }
            }
            this.updateInterval = setInterval(()=>{
                this.update(spell);
            }, 400);
        }
    }

    public hide() {
        if (this.displayed) {
            this.displayed = false;
            this.container.style.visibility = 'hidden';
            for (let fighterId in this.bars) {
                this.destroyBar(fighterId);
            }
            this.bars = [];
            this.wGame.document.getElementById(this.container.id).innerHTML = '';
            clearInterval(this.updateInterval);
        }
    }

    private update(spell:any) {
        if (this.isInFight) {
            let fighters = this.wGame.gui.fightManager.getFighters();
            for (let index in fighters) {
                let fighter = this.wGame.gui.fightManager.getFighter(fighters[index]);
                if (fighter.data.alive) {
                    if (this.bars[fighter.id]) this.bars[fighter.id].update(spell);
                    else this.bars[fighter.id] = new Estimator(fighter, spell, this.wGame);
                }
            }
        }
    }

    public destroyBar(fighterId: any) {
        if (this.bars[fighterId]) {
            this.bars[fighterId].destroy();
            delete this.bars[fighterId];
        }
    }


    public display(spell: any) {
        this.isInFight = true;
        if (this.enabled) this.show(spell);
    }

    public fightEnded() {
        this.isInFight = false;
        if (this.enabled) this.hide();
    }


    public destroy() {
        this.hide();
        this.container.parentElement.removeChild(this.container);

    }
}
