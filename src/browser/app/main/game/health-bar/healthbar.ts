import {Option} from "../../../../shared/settings/settings.service";
import {ShortCuts} from "../../../shortcuts/shortcuts";

export class HealthBar {

    private wGame: any | Window;
    private shortcuts: ShortCuts;
    private updateInterval: NodeJS.Timer;

    constructor(wGame: any, skipLogin: boolean = false) {
        this.wGame = wGame;
        this.shortcuts = new ShortCuts(this.wGame);

        this.shortcuts.bind('p', () => {
            console.log('start halt bar');
            if (!this.wGame.document.getElementById('lifeBars') || this.wGame.document.getElementById('lifeBars').innerHTML == '') {
                this.displayLifeBar();
                this.updateInterval = setInterval(this.updateLifeBar, 300);
            }
            else {
                clearInterval(this.updateInterval);
                this.updateInterval = null;
                this.wGame.document.getElementById('lifeBars').innerHTML = '';
            }
        });
    }

    private addFigtherLife(fighter: any) {
        try {
            let life = fighter.data.stats.lifePoints / fighter.data.stats.maxLifePoints;
            let cellId = fighter.data.disposition.cellId;
            let scenePos = this.wGame.isoEngine.mapRenderer.getCellSceneCoordinate(cellId);
            let pos = this.wGame.isoEngine.mapScene.convertSceneToCanvasCoordinate(scenePos.x, scenePos.y);
            let lifeBarContainer = document.createElement('div');
            lifeBarContainer.id = 'fighterLifeBarContainer' + fighter.id;
            lifeBarContainer.style.cssText = 'box-sizing: border-box; border: 1px gray solid; background-color: #222; height: 10px; width: 80px; position: absolute; border-radius: 3px; overflow: hidden; transition-duration: 500ms;';
            let lifeBar = document.createElement('div');
            lifeBar.id = 'fighterLifeBar' + fighter.id;
            lifeBar.style.cssText = 'background-color: red; transition-duration: 300ms; height: 100%; width: ' + Math.round(life * 100) + '%;';

            if (!this.wGame.gui.fightManager.isFighterOnUsersTeam(fighter.id))
                lifeBar.style.backgroundColor = '#3ad';
            lifeBarContainer.appendChild(lifeBar);
            lifeBarContainer.style.left = (pos.x - 40) + 'px';
            lifeBarContainer.style.top = (pos.y + 10) + 'px';

            let lifePointsEl = document.createElement('div');
            lifePointsEl.id = 'fighterLifePoints' + fighter.id;
            lifePointsEl.innerHTML = fighter.data.stats.lifePoints;
            lifePointsEl.style.cssText = 'position: absolute; width: 80px; text-align: center; color: white; text-shadow: 0px 0px 5px rgba(0, 0, 0, 0.9); transition-duration: 500ms;';
            lifePointsEl.style.left = (pos.x - 40) + 'px';
            lifePointsEl.style.top = (pos.y + 20) + 'px';

            this.wGame.document.getElementById('lifeBars').appendChild(lifeBarContainer);
            this.wGame.document.getElementById('lifeBars').appendChild(lifePointsEl);
        }
        catch (e) {
            console.log(e);
        }
    }

    private updateLifeBar() {
        try {
            if (!this.wGame.isoEngine.mapRenderer.isFightMode) {
                clearInterval(this.updateInterval);
                this.updateInterval = null;
                this.wGame.document.getElementById('lifeBars').innerHTML = '';
            }
            else {
                let fighters = this.wGame.gui.fightManager.getFighters();
                for (let id in fighters) {
                    let fighter = this.wGame.gui.fightManager.getFighter(fighters[id]);
                    let lifeBar = this.wGame.document.getElementById('fighterLifeBar' + fighter.id);
                    let lifeBarContainer = this.wGame.document.getElementById('fighterLifeBarContainer' + fighter.id);
                    let lifePoints = this.wGame.document.getElementById('fighterLifePoints' + fighter.id);
                    if (fighter.data.alive) {
                        if (!lifeBar || !lifeBarContainer || !lifePoints) {
                            this.addFigtherLife(fighter);
                            let lifeBar = this.wGame.document.getElementById('fighterLifeBar' + fighter.id);
                            let lifeBarContainer = this.wGame.document.getElementById('fighterLifeBarContainer' + fighter.id);
                            let lifePoints = this.wGame.document.getElementById('fighterLifePoints' + fighter.id);
                        }
                        let life = fighter.data.stats.lifePoints / fighter.data.stats.maxLifePoints;
                        lifeBar.style.width = Math.round(life * 100) + '%';
                        lifePoints.innerHTML = fighter.data.stats.lifePoints;

                        let cellId = fighter.data.disposition.cellId;
                        if (cellId) {
                            let scenePos = this.wGame.isoEngine.mapRenderer.getCellSceneCoordinate(cellId);
                            let pos = this.wGame.isoEngine.mapScene.convertSceneToCanvasCoordinate(scenePos.x, scenePos.y);
                            lifeBarContainer.style.left = (pos.x - 40) + 'px';
                            lifeBarContainer.style.top = (pos.y + 10) + 'px';
                            lifePoints.style.left = (pos.x - 40) + 'px';
                            lifePoints.style.top = (pos.y + 20) + 'px';
                        }
                    }
                }
            }
        }
        catch (e) {
            console.log(e);
        }
    }

    private displayLifeBar() {
        try {
            if (!this.wGame.document.getElementById('lifeBars')) {
                let container = document.createElement('div');
                container.id = 'lifeBars';
                //container.style = 'position: absolute; top: 0; left: 0; z-index: 1; pointer-events: none;';
                container.style.position = 'absolute';
                container.style.top = '0';
                container.style.left = '0';
                container.style.zIndex = '1';
                container.style.pointerEvents = 'none';
                this.wGame.foreground.rootElement.appendChild(container);
            }

            this.wGame.document.getElementById('lifeBars').innerHTML = '';

            let fighters = this.wGame.gui.fightManager.getFighters();
            for (let id in fighters) {
                let fighter = this.wGame.gui.fightManager.getFighter(fighters[id]);
                if (fighter.data.alive) {
                    this.addFigtherLife(fighter);
                }
            }
        }
        catch (e) {
            console.log(e);
        }
    }

    public reset() {

    }

}