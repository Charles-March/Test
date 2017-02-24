import {Option} from "../../../../shared/settings/settings.service";
import {ShortCuts} from "../../../shortcuts/shortcuts";
import {BarContainer} from "./barcontainer";

export class HealthBar {

    private wGame: any | Window;
    private shortcuts: ShortCuts;
    private barContainer: BarContainer;

    constructor(wGame: any, skipLogin: boolean = false) {
        this.wGame = wGame;
        this.shortcuts = new ShortCuts(this.wGame);
        this.barContainer = new BarContainer(this.wGame);

        this.shortcuts.bind('p', () => {
            console.log('start health bar');
            this.barContainer.toggle();
        });
    }



    public reset() {

    }

}