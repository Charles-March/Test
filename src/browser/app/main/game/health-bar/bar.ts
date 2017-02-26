export class Bar {

    private fighter: any;
    private wGame: any;

    private lifeBarContainer : HTMLDivElement;
    private lifeBar : HTMLDivElement;
    private lifePointsEl : HTMLDivElement;

    constructor(fighter: any, wGame: any | Window){
        this.fighter = fighter;
        this.wGame = wGame;

        this.createBar();

    }

    public getId(){
        return this.fighter.id;
    }

    public update(){
        let fighter = this.wGame.gui.fightManager.getFighter(this.fighter.id);

        if (this.wGame.isoEngine.mapRenderer.isFightMode) {

            if (fighter.data.alive) {
                if (!this.lifeBar || !this.lifeBarContainer || !this.lifePointsEl) {
                    this.createBar();
                }

                let life = fighter.data.stats.lifePoints / fighter.data.stats.maxLifePoints;
                this.lifeBar.style.width = Math.round(life * 100) + '%';
                this.lifePointsEl.innerHTML = fighter.data.stats.lifePoints;

                let invisible = false;
                for (let idB in fighter.buffs) {
                  if (fighter.buffs[idB].effect.effectId == 150) invisible = true;
                }

                let cellId = fighter.data.disposition.cellId;

                if (cellId && !invisible) {
                    let scenePos = this.wGame.isoEngine.mapRenderer.getCellSceneCoordinate(cellId);
                    let pos = this.wGame.isoEngine.mapScene.convertSceneToCanvasCoordinate(scenePos.x, scenePos.y);
                    this.lifeBarContainer.style.left = (pos.x - 40) + 'px';
                    this.lifeBarContainer.style.top = (pos.y + 10) + 'px';
                    this.lifePointsEl.style.left = (pos.x - 40) + 'px';
                    this.lifePointsEl.style.top = (pos.y + 20) + 'px';
                }
            }
        }
    }

    private createBar(){
        /* retrieve data */
        let life = this.fighter.data.stats.lifePoints / this.fighter.data.stats.maxLifePoints;
        let cellId = this.fighter.data.disposition.cellId;
        let scenePos = this.wGame.isoEngine.mapRenderer.getCellSceneCoordinate(cellId);
        let pos = this.wGame.isoEngine.mapScene.convertSceneToCanvasCoordinate(scenePos.x, scenePos.y);

        /* lifeBarContainer */
        this.lifeBarContainer = document.createElement('div');
        this.lifeBarContainer.id = 'fighterLifeBarContainer' + this.fighter.id;
        this.lifeBarContainer.style.cssText = 'box-sizing: border-box; border: 1px gray solid; background-color: #222; height: 10px; width: 80px; position: absolute; border-radius: 3px; overflow: hidden; transition-duration: 500ms;';

        /* lifeBar */
        this.lifeBar = document.createElement('div');
        this.lifeBar.id = 'fighterLifeBar' + this.fighter.id;
        this.lifeBar.style.cssText = 'transition-duration: 300ms; height: 100%; width: ' + Math.round(life * 100) + '%;';

        if (this.fighter.data.teamId == 0) this.lifeBar.style.backgroundColor = 'red';
        else this.lifeBar.style.backgroundColor = '#3ad';
        this.lifeBarContainer.appendChild(this.lifeBar);
        this.lifeBarContainer.style.left = (pos.x - 40) + 'px';
        this.lifeBarContainer.style.top = (pos.y + 10) + 'px';

        /* lifePointsEl */
        this.lifePointsEl = document.createElement('div');
        this.lifePointsEl.id = 'fighterLifePoints' + this.fighter.id;
        this.lifePointsEl.innerHTML = this.fighter.data.stats.lifePoints;
        this.lifePointsEl.style.cssText = 'position: absolute; width: 80px; text-align: center; color: white; text-shadow: 0px 0px 5px rgba(0, 0, 0, 0.9); transition-duration: 500ms;';
        this.lifePointsEl.style.left = (pos.x - 40) + 'px';
        this.lifePointsEl.style.top = (pos.y + 20) + 'px';

        this.wGame.document.getElementById('lifeBars').appendChild(this.lifeBarContainer);
        this.wGame.document.getElementById('lifeBars').appendChild(this.lifePointsEl);
    }

    public destroy(){
        this.lifePointsEl.parentElement.removeChild(this.lifePointsEl);
        this.lifeBar.parentElement.removeChild(this.lifeBar);
        this.lifeBarContainer.parentElement.removeChild(this.lifeBarContainer);
    }
}
