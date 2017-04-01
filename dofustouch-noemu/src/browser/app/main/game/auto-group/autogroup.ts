//background.toggleDebugMode()


// check si GameMovement concerne le leader
// window.gui.playerData.partyData._partyFromId[8614]._leaderId
// si oui est-ce que le leader change de map?
/*dofus.connectionManager.on('GameMapMovementMessage', function (msg) {
 console.info(msg);
 msg.actorId;
 msg.keyMovements
 });*/

// changer de map et le suivre

import {Option} from "../../../../shared/settings/settings.service";
import {EventEmitter} from 'eventemitter3';
type Direction = "top" | "bottom" | "left" | "right" | false;

export class AutoGroup {

    private wGame: any | Window;
    private params: Option.VIP.AutoGroup;
    private events: any[];
    private lock: boolean = false;
    private static counter: number = 1;


    constructor(wGame: any, params: Option.VIP.AutoGroup) {
        this.wGame = wGame;
        this.params = params;
        this.events = [];

        console.info('start auto-group');
        console.info(this.params.leader);

        if (this.params.active) {

            // bind auto accept
            this.autoAcceptPartyInvitation(this.wGame.gui.isConnected);

            // bind follow leader
            if (this.params.follow_leader)
                this.followLeader(this.wGame.gui.isConnected);


            // bind auto enter fight
            if (this.params.fight)
                this.autoEnterFight(this.wGame.gui.isConnected);

            this.autoMasterParty(this.wGame.gui.isConnected);

        }
    }

    public autoMasterParty(skipLogin: boolean = false) {
        let onCharacterSelectedSuccess = () => {
            try {
                setTimeout(() => {
                    if (this.params.leader == this.wGame.gui.playerData.characterBaseInformations.name) {
                        console.info('start master party')
                        let idInt = setInterval(() => {
                            this.masterParty(this.params.members.split(';'));
                        }, 6000);

                        this.events.push(() => {
                            clearInterval(idInt);
                        });

                        this.wGame.gui.on("disconnect", () => {
                            clearInterval(idInt);
                        });
                    }
                }, 3000);
            } catch (e) {
                console.log(e);
            }
        };

        if (skipLogin) {
            onCharacterSelectedSuccess();
        }

        this.wGame.gui.playerData.on("characterSelectedSuccess", onCharacterSelectedSuccess);
        this.events.push(() => {
            this.wGame.gui.playerData.removeListener("characterSelectedSuccess", onCharacterSelectedSuccess);
        });

    }

    private inviteToParty(name: string): void {
        this.wGame.dofus.sendMessage("PartyInvitationRequestMessage", {name: name});
    }

    private acceptPartyInvitation(partyId: number): void {
        this.wGame.dofus.sendMessage("PartyAcceptInvitationMessage", {partyId: partyId});
    }

    public autoAcceptPartyInvitation(skipLogin: boolean = false): void {

        let onCharacterSelectedSuccess = () => {

            try {

                let onPartyInvitationMessage = (msg: any) => {
                    if (this.params.leader === msg.fromName) {
                        this.acceptPartyInvitation(msg.partyId);
                    }
                };

                setTimeout(() => {

                    this.wGame.dofus.connectionManager.on('PartyInvitationMessage', onPartyInvitationMessage);
                    this.events.push(() => {
                        this.wGame.dofus.connectionManager.removeListener('PartyInvitationMessage', onPartyInvitationMessage);
                    });

                    this.wGame.gui.on("disconnect", () => {
                        this.wGame.dofus.connectionManager.removeListener('PartyInvitationMessage', onPartyInvitationMessage);
                    });
                }, 2000);

            } catch (e) {
                console.log(e);
            }
        };

        if (skipLogin) {
            onCharacterSelectedSuccess();
        }

        this.wGame.gui.playerData.on("characterSelectedSuccess", onCharacterSelectedSuccess);
        this.events.push(() => {
            this.wGame.gui.playerData.removeListener("characterSelectedSuccess", onCharacterSelectedSuccess);
        });
    }

    public getPartyMembers(): Array<string> {
        let party = [];
        //si dans un groupe
        if (Object.keys(this.wGame.gui.playerData.partyData._partyFromId).length !== 0) {
            //recup des membres du grp
            let partyMembers = this.wGame.gui.playerData.partyData._partyFromId[Object.keys(this.wGame.gui.playerData.partyData._partyFromId)[0]]._members;
            //mise en forme
            for (let player in partyMembers) {
                party.push(partyMembers[player].name);
            }
        }

        return party;
    }

    private masterParty(nameList: Array<string>) {
        let partyMembers = this.getPartyMembers();
        nameList.forEach((name) => {

            if (!partyMembers.includes(name)) {
                this.wGame.dofus.sendMessage('BasicWhoIsRequestMessage', {
                    search: name,
                    verbose: true
                });

                this.wGame.dofus.connectionManager.once('BasicWhoIsMessage', (msg: any) => {

                    //si perso pas dans le groupe
                    if (msg.playerState == 1) {
                        this.inviteToParty(name);
                    }
                });
            }
        });
    }

    public reset() {
        this.events.forEach((event) => {
            event();
        });
        this.events = [];
    }

    private isBorder(cellId: number): Direction {
        if (0 <= cellId && cellId <= 13 ||
            15 <= cellId && cellId <= 26) {
            return "top";
        }

        if (546 <= cellId && cellId <= 559 ||
            533 <= cellId && cellId <= 545) {
            return "bottom";
        }

        if (cellId % 28 == 0 ||
            cellId % 28 == 14) {
            return "left";
        }
        if (cellId % 28 == 27 ||
            cellId % 28 == 13) {
            return "right"
        }

        return false;
    }

    private getRandomInt(min: number, max: number): number {
        return Math.floor(Math.random() * (max - min + 1)) + min;
    }

    private followFunc(msg: any): void {
        //window.isoEngine.mapRenderer.getChangeMapFlags(426)
        // a utiliser pour check les bordures
        if (Object.keys(this.wGame.gui.playerData.partyData._partyFromId).length !== 0) {
            let party = this.wGame.gui.playerData.partyData._partyFromId[Object.keys(this.wGame.gui.playerData.partyData._partyFromId)[0]];
            if (party._leaderId === msg.actorId && party._leaderId !== this.wGame.gui.playerData.id) {

                let event = new EventEmitter();

                let onGameContextRemoveElementMessage = (msg: any) => {
                    if (!this.lock && msg.id === party._leaderId) {
                        event.once('finish', (cellId) => {
                            this.wGame.isoEngine._movePlayerOnMap(cellId, false, null);
                        });
                        console.log(msg);
                    }
                };

                this.wGame.dofus.connectionManager.once('GameContextRemoveElementMessage', onGameContextRemoveElementMessage);

                // récupération de la denrière cellule
                let lastCellId = msg.keyMovements[msg.keyMovements.length - 1];
                let direction = this.isBorder(lastCellId);

                // calcul du délai aléatoire
                let delay = 0;
                let max = 15;
                let min = -15;
                if (this.params.delay > 0) {
                    delay = (this.params.delay + this.params.delay * (Math.floor(Math.random() * (max - min + 1)) + min) * 0.01) * 1000;
                    delay = delay * AutoGroup.counter++;
                }


                setTimeout(() => {
                    // Si le mouvement n'est pas lock on bouge
                    if (!this.lock) {
                        let cellDirection = lastCellId;
                        if (direction) {
                            this.wGame.isoEngine.gotoNeighbourMap(direction, lastCellId, 144, 4);
                            this.wGame.dofus.connectionManager.removeListener('GameContextRemoveElementMessage', onGameContextRemoveElementMessage);
                        } else {
                            if (this.params.random_move) {

                                let steps = [-15, -1, 13, 28, 14, 1, -14, -28];

                                let step = steps[this.getRandomInt(0, 7)];

                                cellDirection = lastCellId + step;
                            }

                            this.wGame.isoEngine._movePlayerOnMap(cellDirection, false, () => {
                                event.emit('finish', lastCellId);
                                setTimeout(() => {
                                    this.wGame.dofus.connectionManager.removeListener('GameContextRemoveElementMessage', onGameContextRemoveElementMessage);
                                }, 500);
                            });
                        }
                    }

                }, delay);
            } else if (party._leaderId === msg.actorId && party._leaderId === this.wGame.gui.playerData.id) {
                AutoGroup.counter = 1;
            }
        }
    }

    private followInteractivFunc(msg: any): void {
        if (Object.keys(this.wGame.gui.playerData.partyData._partyFromId).length !== 0) {
            let party = this.wGame.gui.playerData.partyData._partyFromId[Object.keys(this.wGame.gui.playerData.partyData._partyFromId)[0]];
            if (party._leaderId === msg.entityId && party._leaderId !== this.wGame.gui.playerData.id) {

                // On lock le movement pour eviter que followFunc prenne le dessus
                this.lock = true;

                let delay = 0;
                let max = 15;
                let min = -15;
                if (this.params.delay > 0) {
                    delay = (this.params.delay + this.params.delay * (Math.floor(Math.random() * (max - min + 1)) + min) * 0.01) * 1000;
                    delay = delay * AutoGroup.counter++;
                }

                let interactive = this.wGame.isoEngine.mapRenderer.interactiveElements[msg.elemId];
                let skillId = msg.skillId;
                let skillInstanceUid: any = null;

                for (let id in interactive.enabledSkills) {
                    if (interactive.enabledSkills[id].skillId == skillId) {
                        skillInstanceUid = interactive.enabledSkills[id].skillInstanceUid;
                        break;
                    }
                }

                setTimeout(() => {
                    this.wGame.isoEngine.useInteractive(msg.elemId, skillInstanceUid);
                    this.lock = false;
                }, delay);

            } else {
                AutoGroup.counter = 1;
            }
        }
    }

    public followLeader(skipLogin: boolean = false): void {

        let onCharacterSelectedSuccess = () => {

            try {

                let onGameMapMovementMessage = (msg: any) => {
                    this.followFunc(msg);
                };

                let onInteractiveUsedMessage = (msg: any) => {
                    this.followInteractivFunc(msg);
                    //window.isoEngine.useInteractive(elemId, skillInstanceUid);
                };


                setTimeout(() => {
                    this.wGame.dofus.connectionManager.on('GameMapMovementMessage', onGameMapMovementMessage);
                    this.wGame.dofus.connectionManager.on('InteractiveUsedMessage', onInteractiveUsedMessage);

                    this.events.push(() => {
                        this.wGame.dofus.connectionManager.removeListener('GameMapMovementMessage', onGameMapMovementMessage);
                        this.wGame.dofus.connectionManager.removeListener('InteractiveUsedMessage', onInteractiveUsedMessage);
                    });

                    this.wGame.gui.on("disconnect", () => {
                        this.wGame.dofus.connectionManager.removeListener('GameMapMovementMessage', onGameMapMovementMessage);
                        this.wGame.dofus.connectionManager.removeListener('InteractiveUsedMessage', onInteractiveUsedMessage);
                    });

                }, 2000);

            } catch (e) {
                console.log(e);
            }
        };

        if (skipLogin) {
            onCharacterSelectedSuccess();
        }


        this.wGame.gui.playerData.on("characterSelectedSuccess", onCharacterSelectedSuccess);
        this.events.push(() => {
            this.wGame.gui.playerData.removeListener("characterSelectedSuccess", onCharacterSelectedSuccess);
        });
    }

    public autoEnterFight(skipLogin: boolean = false) {

        let onCharacterSelectedSuccess = () => {

            try {
                let joinFight = (fightId: number, fighterId: number) => {
                    return new Promise((resolve, reject) => {
                        this.wGame.dofus.sendMessage("GameFightJoinRequestMessage", {fightId, fighterId});
                        setTimeout(() => {
                            resolve();
                        }, 1500);
                    });
                };

                let ready = () => {
                    return new Promise((resolve, reject) => {
                        this.wGame.dofus.sendMessage("GameFightReadyMessage", {isReady: true});
                        setTimeout(() => {
                            resolve();
                        }, 200);
                    });
                };

                let onPartyMemberInFightMessage = (e: any) => {
                    if (this.wGame.isoEngine.mapRenderer.mapId === e.fightMap.mapId) {
                        joinFight(e.fightId, e.memberId)
                            .then(() => {
                                if (this.params.ready)
                                    return ready();
                                else
                                    return;
                            });
                    }

                };

                setTimeout(() => {
                    this.wGame.dofus.connectionManager.on("PartyMemberInFightMessage", onPartyMemberInFightMessage);
                    this.events.push(() => {
                        this.wGame.dofus.connectionManager.removeListener("PartyMemberInFightMessage", onPartyMemberInFightMessage);
                    });

                    this.wGame.gui.on("disconnect", () => {
                        this.wGame.dofus.connectionManager.removeListener('PartyMemberInFightMessage', onPartyMemberInFightMessage);
                    });

                }, 2000);

            } catch (e) {
                console.log(e);
            }
        };

        if (skipLogin) {
            onCharacterSelectedSuccess();
        }

        this.wGame.gui.playerData.on("characterSelectedSuccess", onCharacterSelectedSuccess);
        this.events.push(() => {
            this.wGame.gui.playerData.removeListener("characterSelectedSuccess", onCharacterSelectedSuccess);
        });
    }
}