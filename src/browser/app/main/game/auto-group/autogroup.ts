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
type Direction = "top" | "bottom" | "left" | "right" | false;

export class AutoGroup {

    private wGame: any;
    private params: Option.VIP.AutoGroup;
    private events: any[];


    constructor(wGame: any, params: Option.VIP.AutoGroup) {
        this.wGame = wGame;
        this.params = params;
        this.events = [];

        console.info('start auto-group');
        console.info(this.params.leader);

        if (this.params.active) {

            // bind follow leader
            if (this.params.follow_leader)
                this.followLeader();

            // bind auto accept
            if (this.params.fight)
                this.autoAcceptPartyInvitation();

            // bind auto enter fight
            if (this.params.fight)
                this.autoEnterFight();

            this.autoMasterParty();

        }
    }

    public autoMasterParty() {
        let onCharacterSelectedSuccess = () => {

            setTimeout(() => {
                if (this.params.leader == this.wGame.gui.playerData.characterBaseInformations.name) {
                    console.info('start master party')
                    let idInt = setInterval(() => {
                        this.masterParty(this.params.members.split(';'));
                    }, 3000);

                    this.events.push(() => {
                        clearInterval(idInt);
                    });

                    this.wGame.gui.on("disconnect", () => {
                        clearInterval(idInt);
                    });
                }
            }, 3000);
        };

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

    public autoAcceptPartyInvitation(): void {

        let onCharacterSelectedSuccess = () => {

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
        };

        this.wGame.gui.playerData.on("characterSelectedSuccess", onCharacterSelectedSuccess);
        this.events.push(() => {
            this.wGame.gui.playerData.removeListener("characterSelectedSuccess", onCharacterSelectedSuccess);
        });
    }

    public getPartyMembers(): Array<string> {
        let party = new Array();
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

    private followFunc(msg: any): void {
        if (Object.keys(this.wGame.gui.playerData.partyData._partyFromId).length !== 0) {
            let party = this.wGame.gui.playerData.partyData._partyFromId[Object.keys(this.wGame.gui.playerData.partyData._partyFromId)[0]];
            if (party._leaderId === msg.actorId && party._leaderId !== this.wGame.gui.playerData.id) {

                let lastCellId = msg.keyMovements[msg.keyMovements.length - 1];
                let direction = this.isBorder(lastCellId);

                let delay = 0;
                let max = 15;
                let min = -15;
                if (this.params.delay > 0)
                    delay = (this.params.delay + this.params.delay * (Math.floor(Math.random() * (max - min + 1)) + min) * 0.01) * 1000;

                setTimeout(() => {
                    if (direction) {
                        this.wGame.isoEngine.gotoNeighbourMap(direction, lastCellId, 144, 4);
                    } else {
                        let step = 1;

                        if (Math.round(Math.random()) == 1) {
                            step = -1;
                        }
                        this.wGame.isoEngine._movePlayerOnMap(step + lastCellId, false, null);
                    }
                }, delay);
            }
        }
    }

    public followLeader(): void {

        let onCharacterSelectedSuccess = () => {

            let onGameMapMovementMessage = (msg: any) => {
                this.followFunc(msg);
            };

            setTimeout(() => {
                this.wGame.dofus.connectionManager.on('GameMapMovementMessage', onGameMapMovementMessage);
                this.events.push(() => {
                    this.wGame.dofus.connectionManager.removeListener('GameMapMovementMessage', onGameMapMovementMessage);
                });

                this.wGame.gui.on("disconnect", () => {
                    this.wGame.dofus.connectionManager.removeListener('GameMapMovementMessage', onGameMapMovementMessage);
                });

            }, 2000);
        };


        this.wGame.gui.playerData.on("characterSelectedSuccess", onCharacterSelectedSuccess);
        this.events.push(() => {
            this.wGame.gui.playerData.removeListener("characterSelectedSuccess", onCharacterSelectedSuccess);
        });
    }

    public autoEnterFight() {

        let onCharacterSelectedSuccess = () => {
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
                joinFight(e.fightId, e.memberId)
                    .then(() => {
                        return ready();
                    });
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
        };

        this.wGame.gui.playerData.on("characterSelectedSuccess", onCharacterSelectedSuccess);
        this.events.push(() => {
            this.wGame.gui.playerData.removeListener("characterSelectedSuccess", onCharacterSelectedSuccess);
        });
    }
}