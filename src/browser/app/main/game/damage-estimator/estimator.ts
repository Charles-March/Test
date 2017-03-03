export class Estimator {

    private fighter: any;
    private spell: any;
    private wGame: any;

    private estimatorContainer: HTMLDivElement;
    private damagePoints: HTMLDivElement;

    constructor(fighter: any, spell: any, wGame: any | Window) {
        this.fighter = fighter;
        this.wGame = wGame;
        this.spell = spell;

        this.createEstimator();
    }

    public update(spell: any) {
        this.spell = spell;

        let fighter = this.wGame.gui.fightManager.getFighter(this.fighter.id);

        if (this.wGame.isoEngine.mapRenderer.isFightMode) {

            if (fighter.data.alive) {
                if (!this.estimatorContainer || !this.damagePoints) {
                    this.createEstimator();
                }

                let invisible = false;
                for (let idB in fighter.buffs) {
                    if (fighter.buffs[idB].effect.effectId == 150)
                        invisible = true;
                }

                let cellId = fighter.data.disposition.cellId;

                if (cellId && !invisible) {
                    let scenePos = this.wGame.isoEngine.mapRenderer.getCellSceneCoordinate(cellId);
                    let pos = this.wGame.isoEngine.mapScene.convertSceneToCanvasCoordinate(scenePos.x, scenePos.y);
                    this.estimatorContainer.style.left = (pos.x - 40) + 'px';
                    this.estimatorContainer.style.top = (pos.y - 80) + 'px';
                    this.damagePoints.style.left = (pos.x - 40) + 'px';
                    this.damagePoints.style.top = (pos.y - 81) + 'px';
                }
            }
        }
    }

    private createEstimator() {
        /* retrieve data */
        let cellId = this.fighter.data.disposition.cellId;
        let scenePos = this.wGame.isoEngine.mapRenderer.getCellSceneCoordinate(cellId);
        let pos = this.wGame.isoEngine.mapScene.convertSceneToCanvasCoordinate(scenePos.x, scenePos.y);

        /* lifeBarContainer */
        if(this.wGame.document.getElementById('estimatorContainer' + this.fighter.id)){
            this.estimatorContainer = this.wGame.document.getElementById('estimatorContainer' + this.fighter.id);
        }else{
            this.estimatorContainer = document.createElement('div');
            this.estimatorContainer.id = 'estimatorContainer' + this.fighter.id;
        }

        this.estimatorContainer.style.cssText = 'box-sizing: border-box; border: 1px gray solid; background-color: #222; height: 13px; width: 80px; position: absolute; border-radius: 3px; overflow: hidden; transition-duration: 500ms;';
        this.estimatorContainer.style.left = (pos.x - 40) + 'px';
        this.estimatorContainer.style.top = (pos.y - 80) + 'px';

        /* lifePointsEl */
        if(this.wGame.document.getElementById('damagePoints' + this.fighter.id)){
            this.damagePoints = this.wGame.document.getElementById('damagePoints' + this.fighter.id);
        }else{
            this.damagePoints = document.createElement('div');
            this.damagePoints.id = 'damagePoints' + this.fighter.id;
        }
        this.damagePoints.innerHTML = this.getEstimations(this.spell, this.fighter);
        this.damagePoints.style.cssText = 'font-size:10px; position: absolute; width: 80px; text-align: center; color: white; text-shadow: 0px 0px 5px rgba(0, 0, 0, 0.9); transition-duration: 500ms;';
        this.damagePoints.style.left = (pos.x - 40) + 'px';
        this.damagePoints.style.top = (pos.y - 81) + 'px';

        this.wGame.document.getElementById('damage-estimator').appendChild(this.estimatorContainer);
        this.wGame.document.getElementById('damage-estimator').appendChild(this.damagePoints);
    }

    public destroy() {
        this.damagePoints.parentElement.removeChild(this.damagePoints);
        this.estimatorContainer.parentElement.removeChild(this.estimatorContainer);
    }

    //-------------------------------------------------------------------------------------------------

    //obtient les estimations de dégats
    private getEstimations(spell: any, fighter: any): string {
        let display: string = "";
        //pour chaque effet du sort
        for (var effectId in spell.spellLevel.effects) {
            let effect = spell.spellLevel.effects[effectId];

            //si effet direct
            if (effect._type == "EffectInstanceDice") {
                let element = this.effectIdToElement(effect.effectId);
                if (element != "undefined") {
                    let min = this.getMinDamageDealed(element, fighter, effect);
                    let max = this.getMaxDamageDealed(element, fighter, effect);
                    display += "(" + min + " - " + max + ")";
                }
            }
            else {
                console.log("Quel cet effet mystique ?" + effect._type);
                console.log(effect);
                console.log("De ce sort:");
                console.log(spell);
            }
        }
        return display;
    }

    /**
     * (info) Il s'agit d'un nombre qui, comme son nom l'indique, va être multiplié avec le jet. Il est composé d'une de vos caractéristique, selon l'élément de votre sort ou arme, ainsi que de votre puissance.
     *
     * Multiplicateur = (Puissance + Caractéristique+100)/100
     */
    private getFactor(element: string) {
        let carac = 0;
        switch (element) {
            case 'air':
                carac = this.getAgility();
                break;
            case 'fire':
                carac = this.getIntelligence();
                break;
            case 'earth':
            case 'neutral':
                carac = this.getStrength();
                break;
            case 'water':
                carac = this.getChance();
                break;

            default:
                break;
        }
        return (this.getPower() + carac + 100 ) / 100;
    }

    /**
     * Le fixe est un bonus qui s'ajoute aux dégâts indépendamment du jet. Cela vous permet d'assurer un minimum de dégâts à chaque attaque, même si le jet obtenu est faible.
     *
     * Fixe = Dommages + Dommages élémentaires (+ Dommages critiques si vous faites un Coup Critique)
     */
    private getFixDamages(element: string) {
        //TODO crit
        let elementalDamages = 0;
        switch (element) {
            case 'air':
                elementalDamages = this.getAirDamage();
                break;
            case 'fire':
                elementalDamages = this.getFireDamage();
                break;
            case 'earth':
                elementalDamages = this.getEarthDamage();
                break;
            case 'water':
                elementalDamages = this.getWaterDamage();
                break;
            case 'neutral':
                elementalDamages = this.getNeutralDamage();
                break;

            default:
                break;
        }
        return this.getFullCharaBonus(this.wGame.gui.playerData.characters.mainCharacter.characteristics.allDamagesBonus) + elementalDamages;
    }

    /**
     * Dégâts bruts = Partie entière[Multiplicateur x Jet + Fixe]
     *
     * effect: un des effets d'un sort
     */
    private getMinBrutDamages(element: string, effect: any) {
        //diceNume le je minimum d'un sort
        console.log("Math.trunc(" + this.getFactor(element) + "* " + effect.diceNum + " + " + this.getFixDamages(element) + ")");
        return Math.trunc(this.getFactor(element) * effect.diceNum + this.getFixDamages(element));
    }

    private getMaxBrutDamages(element: string, effect: any) {
        //diceMax le jet maximum d'un sort
        return Math.trunc(this.getFactor(element) * effect.diceSide + this.getFixDamages(element));
    }

    private effectIdToElement(effectId: number) {
        switch (effectId) {
            case 99:
                //dommages feu
                return 'fire';
            case 96:
                //dommages eau
                return 'water';
            case 97:
                //dommages terre
                return 'earth';
            case 98:
                //dommages air
                return 'air';
            case 116: //perte PO
            default:
                console.log("effectId inconnu:" + effectId);
                return 'undefined';
        }
    }

    private getMaxDamageDealed(element: string, fighter: any, effect: any) {
        return Math.trunc((this.getMaxBrutDamages(element, effect) - this.getResFix(element, fighter)) * (100 - this.getPercentRes(element, fighter)) / 100);
    }

    /**
     *
     * Dégâts subis = Partie entière([Dégâts bruts - ​Bonus fixes] * [100 - Résistance en %]/ 100)
     */
    private getMinDamageDealed(element: string, fighter: any, effect: any) {
        console.log("cacul " + element + ": Math.trunc((" + this.getMinBrutDamages(element, effect) + " - " + this.getResFix(element, fighter) + ") * (100 - " + this.getPercentRes(element, fighter) + ")/100)");

        return Math.trunc((this.getMinBrutDamages(element, effect) - this.getResFix(element, fighter)) * (100 - this.getPercentRes(element, fighter)) / 100);
    }

//retourne le montant total de la carac (bonus inclus)
    private getFullCharaBonus(characteristic: any) {
        let sum = 0;
        if (typeof characteristic.base !== 'undefined') {
            sum += characteristic.base;
        }
        if (typeof characteristic.contextModif !== 'undefined') {
            sum += characteristic.contextModif;
        }
        if (typeof characteristic.objectsAndMountBonus !== 'undefined') {
            sum += characteristic.objectsAndMountBonus;
        }
        if (typeof characteristic.alignGiftBonus !== 'undefined') {
            sum += characteristic.alignGiftBonus;
        }
        return sum;
    }

//puissance
    private getPower() {
        let d = this.wGame.gui.playerData.characters.mainCharacter.characteristics.damagesBonusPercent;
        let p = this.wGame.gui.playerData.characters.mainCharacter.characteristics.permanentDamagePercent;
        return this.getFullCharaBonus(d) + this.getFullCharaBonus(p);
    }

// ---- éléments ----
    private getAgility() {
        let a = this.wGame.gui.playerData.characters.mainCharacter.characteristics.agility;
        return this.getFullCharaBonus(a);
    }

    private getChance() {
        let a = this.wGame.gui.playerData.characters.mainCharacter.characteristics.chance;
        return this.getFullCharaBonus(a);
    }

    private getIntelligence() {
        let a = this.wGame.gui.playerData.characters.mainCharacter.characteristics.intelligence;
        return this.getFullCharaBonus(a);
    }

    private getStrength() {
        let a = this.wGame.gui.playerData.characters.mainCharacter.characteristics.strength;
        return this.getFullCharaBonus(a);
    }

// ---- dommages élémentaires ---
    private getAirDamage() {
        let a = this.wGame.gui.playerData.characters.mainCharacter.characteristics.airDamageBonus;
        return this.getFullCharaBonus(a);
    }

    private getFireDamage() {
        let a = this.wGame.gui.playerData.characters.mainCharacter.characteristics.fireDamageBonus;
        return this.getFullCharaBonus(a);
    }

    private getEarthDamage() {
        let a = this.wGame.gui.playerData.characters.mainCharacter.characteristics.earthDamageBonus;
        return this.getFullCharaBonus(a);
    }

    private getWaterDamage() {
        let a = this.wGame.gui.playerData.characters.mainCharacter.characteristics.waterDamageBonus;
        return this.getFullCharaBonus(a);
    }

    private getNeutralDamage() {
        let a = this.wGame.gui.playerData.characters.mainCharacter.characteristics.neutralDamageBonus;
        return this.getFullCharaBonus(a);
    }

// --- resistances / faiblesses ---
    /**
     *
     * Bonus fixe = Résistance élémentaire fixe + Résistance fixe des sorts (+Résistance critique si le sort fait un coup critique)
     */
    private getFixBonus(element: string, fighter: any) {
        //TODO crit
        return this.getResFix(element, fighter) + this.getResFixSpell(fighter);
    }

//resistance élémentaire fixe
    private getResFix(element: string, fighter: any) {
        let stats = fighter.data.stats;
        let res = 0;
        switch (element) {
            case 'air':
                res = stats.waterElementReduction;
                break;
            case 'fire':
                res = stats.fireElementReduction;
                break;
            case 'earth':
                res = stats.earthElementReduction;
                break;
            case 'water':
                res = stats.waterElementReduction;
                break;
            case 'neutral':
                res = stats.neutralElementReduction;
                break;

            default:
                break;
        }
        return res;
    }

//restance fixe des sorts (mot prev ...)
    private getResFixSpell(fighter: any) {
        let res = 0;
        let lvl = fighter.data.level;
        for (var buff in fighter.buffs) {
            //si reduction de dégats
            /*if (buff.effect.effect.characteristic == 16) {
                res += buff.effect.value * (100 + 5 * lvl) / 100;
            }*/
        }
        return res;
    }

//res en pourcents
    private getPercentRes(element: string, fighter: any) {
        let stats = fighter.data.stats;
        let res = 0;
        switch (element) {
            case 'air':
                res = stats.waterElementResistPercent;
                break;
            case 'fire':
                res = stats.fireElementResistPercent;
                break;
            case 'earth':
                res = stats.earthElementResistPercent;
                break;
            case 'water':
                res = stats.waterElementResistPercent;
                break;
            case 'neutral':
                res = stats.neutralElementResistPercent;
                break;

            default:
                break;
        }
        return res;
    }
}
