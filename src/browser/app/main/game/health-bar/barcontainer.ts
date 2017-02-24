import {Bar} from "./bar";
export class BarContainer {

    private wGame: any | Window;
    private container: HTMLDivElement;
    private display: boolean = false;
    private bars: Bar[] = [];

    constructor(wGame: Window | any) {
        this.wGame = wGame;

        this.container = document.createElement('div');
        this.container.id = 'lifeBars';
        this.container.style.position = 'absolute';
        this.container.style.top = '0';
        this.container.style.left = '0';
        this.container.style.zIndex = '1';
        this.container.style.pointerEvents = 'none';
        this.container.style.visibility = 'hidden';

        this.wGame.foreground.rootElement.appendChild(this.container);

    }

    public toggle() {
        if (this.display) {
            this.display = !this.display;
            this.container.style.visibility = 'hidden';
            this.bars.forEach((bar) => {
                bar.destroy();
            });
            this.wGame.document.getElementById('lifeBars').innerHTML = '';
        } else {
            this.display = !this.display;
            this.container.style.visibility = 'visible';

            let fighters = this.wGame.gui.fightManager.getFighters();
            for (let index in fighters) {
                let fighter = this.wGame.gui.fightManager.getFighter(fighters[index]);
                if (fighter.data.alive) {
                    this.bars.push(new Bar(fighter, this.wGame));
                }
            }
        }


    }


}