"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
const core_1 = require("@angular/core");
const ipcrenderer_service_1 = require("../electron/ipcrenderer.service");
const settings = global.nodeRequire('electron-settings');
class Option {
    get buildVersion() {
        return this._buildVersion;
    }
    set buildVersion(buildVersion) {
        settings.setSync('option.buildVersion', buildVersion);
        this._buildVersion = buildVersion;
    }
    get appVersion() {
        return this._appVersion;
    }
    set appVersion(appVersion) {
        settings.setSync('option.appVersion', appVersion);
        this._appVersion = appVersion;
    }
    constructor() {
        this.general = new Option.General();
        this.shortcuts = new Option.Shortcuts();
        this.notification = new Option.Notification();
        this._appVersion = settings.getSync('option.appVersion');
        this._buildVersion = settings.getSync('option.buildVersion');
    }
}
exports.Option = Option;
(function (Option) {
    class Shortcuts {
        constructor() {
            this.no_emu = new Shortcuts.NoEmu();
            this.diver = new Shortcuts.Diver();
            this.interface = new Shortcuts.Interface();
            this._spell = settings.getSync('option.shortcuts.spell');
            this._item = settings.getSync('option.shortcuts.item');
        }
        get spell() {
            return new Proxy(this._spell, {
                get: function (target, name) {
                    return target[name];
                },
                set(target, prop, value) {
                    target[prop] = value;
                    settings.setSync('option.shortcuts.spell', target);
                    return true;
                }
            });
        }
        set spell(spell) {
            settings.setSync('option.shortcuts.spell', spell);
            this._spell = spell;
        }
        get item() {
            return new Proxy(this._item, {
                get: function (target, name) {
                    return target[name];
                },
                set(target, prop, value) {
                    target[prop] = value;
                    settings.setSync('option.shortcuts.item', target);
                    return true;
                }
            });
        }
        set item(item) {
            settings.setSync('option.shortcuts.item', item);
            this._item = item;
        }
    }
    Option.Shortcuts = Shortcuts;
    (function (Shortcuts) {
        class Interface {
            constructor() {
                this._carac = settings.getSync('option.shortcuts.interface.carac');
                this._spell = settings.getSync('option.shortcuts.interface.spell');
                this._bag = settings.getSync('option.shortcuts.interface.bag');
                this._bidhouse = settings.getSync('option.shortcuts.interface.bidhouse');
                this._map = settings.getSync('option.shortcuts.interface.map');
                this._friend = settings.getSync('option.shortcuts.interface.friend');
                this._book = settings.getSync('option.shortcuts.interface.book');
                this._guild = settings.getSync('option.shortcuts.interface.guild');
                this._conquest = settings.getSync('option.shortcuts.interface.conquest');
                this._job = settings.getSync('option.shortcuts.interface.job');
                this._alliance = settings.getSync('option.shortcuts.interface.alliance');
                this._mount = settings.getSync('option.shortcuts.interface.mount');
                this._directory = settings.getSync('option.shortcuts.interface.directory');
                this._alignement = settings.getSync('option.shortcuts.interface.alignement');
                this._bestiary = settings.getSync('option.shortcuts.interface.bestiary');
                this._title = settings.getSync('option.shortcuts.interface.title');
                this._achievement = settings.getSync('option.shortcuts.interface.achievement');
                this._almanax = settings.getSync('option.shortcuts.interface.almanax');
                this._spouse = settings.getSync('option.shortcuts.interface.spouse');
                this._shop = settings.getSync('option.shortcuts.interface.shop');
                this._goultine = settings.getSync('option.shortcuts.interface.goultine');
            }
            get carac() {
                return this._carac;
            }
            set carac(carac) {
                settings.setSync('option.shortcuts.interface.carac', carac);
                this._carac = carac;
            }
            get spell() {
                return this._spell;
            }
            set spell(spell) {
                settings.setSync('option.shortcuts.interface.spell', spell);
                this._spell = spell;
            }
            get bag() {
                return this._bag;
            }
            set bag(bag) {
                settings.setSync('option.shortcuts.interface.bag', bag);
                this._bag = bag;
            }
            get bidhouse() {
                return this._bidhouse;
            }
            set bidhouse(bidhouse) {
                settings.setSync('option.shortcuts.interface.bidhouse', bidhouse);
                this._bidhouse = bidhouse;
            }
            get map() {
                return this._map;
            }
            set map(map) {
                settings.setSync('option.shortcuts.interface.map', map);
                this._map = map;
            }
            get friend() {
                return this._friend;
            }
            set friend(friend) {
                settings.setSync('option.shortcuts.interface.friend', friend);
                this._friend = friend;
            }
            get book() {
                return this._book;
            }
            set book(book) {
                settings.setSync('option.shortcuts.interface.book', book);
                this._book = book;
            }
            get guild() {
                return this._guild;
            }
            set guild(guild) {
                settings.setSync('option.shortcuts.interface.guild', guild);
                this._guild = guild;
            }
            get conquest() {
                return this._conquest;
            }
            set conquest(conquest) {
                settings.setSync('option.shortcuts.interface.guild', conquest);
                this._conquest = conquest;
            }
            get job() {
                return this._job;
            }
            set job(job) {
                settings.setSync('option.shortcuts.interface.job', job);
                this._job = job;
            }
            get alliance() {
                return this._alliance;
            }
            set alliance(alliance) {
                settings.setSync('option.shortcuts.interface.alliance', alliance);
                this._alliance = alliance;
            }
            get mount() {
                return this._mount;
            }
            set mount(mount) {
                settings.setSync('option.shortcuts.interface.guild', mount);
                this._mount = mount;
            }
            get directory() {
                return this._directory;
            }
            set directory(directory) {
                settings.setSync('option.shortcuts.interface.directory', directory);
                this._directory = directory;
            }
            get alignement() {
                return this._alignement;
            }
            set alignement(alignement) {
                settings.setSync('option.shortcuts.interface.alignement', alignement);
                this._alignement = alignement;
            }
            get bestiary() {
                return this._bestiary;
            }
            set bestiary(bestiary) {
                settings.setSync('option.shortcuts.interface.bestiary', bestiary);
                this._bestiary = bestiary;
            }
            get title() {
                return this._title;
            }
            set title(title) {
                settings.setSync('option.shortcuts.interface.title', title);
                this._title = title;
            }
            get achievement() {
                return this._achievement;
            }
            set achievement(achievement) {
                settings.setSync('option.shortcuts.interface.achievement', achievement);
                this._achievement = achievement;
            }
            get almanax() {
                return this._almanax;
            }
            set almanax(almanax) {
                settings.setSync('option.shortcuts.interface.almanax', almanax);
                this._almanax = almanax;
            }
            get spouse() {
                return this._spouse;
            }
            set spouse(spouse) {
                settings.setSync('option.shortcuts.interface.spouse', spouse);
                this._spouse = spouse;
            }
            get shop() {
                return this._shop;
            }
            set shop(shop) {
                settings.setSync('option.shortcuts.interface.shop', shop);
                this._shop = shop;
            }
            get goultine() {
                return this._goultine;
            }
            set goultine(goultine) {
                settings.setSync('option.shortcuts.interface.goultine', goultine);
                this._goultine = goultine;
            }
            getAll() {
                let tab = [];
                for (let prop in this) {
                    let newProp = prop.replace('_', '');
                    tab.push({
                        key: newProp,
                        value: this[prop]
                    });
                }
                return tab;
            }
        }
        Shortcuts.Interface = Interface;
        class NoEmu {
            constructor() {
                this.new_tab = settings.getSync('option.shortcuts.no_emu.new_tab');
                this.new_window = settings.getSync('option.shortcuts.no_emu.new_window');
                this.next_tab = settings.getSync('option.shortcuts.no_emu.next_tab');
                this.prev_tab = settings.getSync('option.shortcuts.no_emu.prev_tab');
                this.activ_tab = settings.getSync('option.shortcuts.no_emu.activ_tab');
                this.tabs = settings.getSync('option.shortcuts.no_emu.tabs');
            }
            get new_tab() {
                return this._new_tab;
            }
            set new_tab(new_tab) {
                settings.setSync('option.shortcuts.no_emu.new_tab', new_tab);
                this._new_tab = new_tab;
            }
            get new_window() {
                return this._new_window;
            }
            set new_window(new_window) {
                settings.setSync('option.shortcuts.no_emu.new_window', new_window);
                this._new_window = new_window;
            }
            get next_tab() {
                return this._next_tab;
            }
            set next_tab(next_tab) {
                settings.setSync('option.shortcuts.no_emu.next_tab', next_tab);
                this._next_tab = next_tab;
            }
            get prev_tab() {
                return this._prev_tab;
            }
            set prev_tab(prev_tab) {
                settings.setSync('option.shortcuts.no_emu.prev_tab', prev_tab);
                this._prev_tab = prev_tab;
            }
            get activ_tab() {
                return this._activ_tab;
            }
            set activ_tab(activ_tab) {
                settings.setSync('option.shortcuts.no_emu.activ_tab', activ_tab);
                this._activ_tab = activ_tab;
            }
            get tabs() {
                return new Proxy(this._tabs, {
                    get: function (target, name) {
                        return target[name];
                    },
                    set(target, prop, value) {
                        target[prop] = value;
                        settings.setSync('option.shortcuts.no_emu.tabs', target);
                        return true;
                    }
                });
            }
            set tabs(tabs) {
                console.log(tabs);
                settings.setSync('option.shortcuts.no_emu.tabs', tabs);
                this._tabs = tabs;
            }
        }
        Shortcuts.NoEmu = NoEmu;
        class Diver {
            constructor() {
                this.end_turn = settings.getSync('option.shortcuts.diver.end_turn');
            }
            get end_turn() {
                return this._end_turn;
            }
            set end_turn(end_turn) {
                settings.setSync('option.shortcuts.diver.end_turn', end_turn);
                this._end_turn = end_turn;
            }
        }
        Shortcuts.Diver = Diver;
    })(Shortcuts = Option.Shortcuts || (Option.Shortcuts = {}));
    class General {
        constructor() {
            this.hidden_shop = settings.getSync('option.general.hidden_shop');
            this.developper_mode = settings.getSync('option.general.developper_mode');
            this.resolution = settings.getSync('option.general.resolution');
        }
        get hidden_shop() {
            return this._hidden_shop;
        }
        set hidden_shop(hidden_shop) {
            settings.setSync('option.general.hidden_shop', hidden_shop);
            this._hidden_shop = hidden_shop;
        }
        get developper_mode() {
            return this._developper_mode;
        }
        set developper_mode(developper_mode) {
            settings.setSync('option.general.developper_mode', developper_mode);
            this._developper_mode = developper_mode;
        }
        get resolution() {
            return this._resolution;
        }
        set resolution(resolution) {
            settings.setSync('option.general.resolution', resolution);
            this._resolution = resolution;
        }
    }
    Option.General = General;
    class Notification {
        constructor() {
            this.fight_turn = settings.getSync('option.notification.fight_turn');
            this.private_message = settings.getSync('option.notification.private_message');
        }
        get private_message() {
            return this._private_message;
        }
        set private_message(private_message) {
            settings.setSync('option.notification.private_message', private_message);
            this._private_message = private_message;
        }
        get fight_turn() {
            return this._fight_turn;
        }
        set fight_turn(fight_turn) {
            settings.setSync('option.notification.fight_turn', fight_turn);
            this._fight_turn = fight_turn;
        }
    }
    Option.Notification = Notification;
})(Option = exports.Option || (exports.Option = {}));
let SettingsService = class SettingsService {
    constructor(ipcRendererService, zone) {
        this.ipcRendererService = ipcRendererService;
        this.zone = zone;
        this.option = new Option();
        this.ipcRendererService.on('reload-settings', () => {
            console.log('receive->reload-settings');
            //this.option = nullx;
            let resetOption = new Option(); // synchronous call
            this.option.shortcuts.no_emu = resetOption.shortcuts.no_emu;
            this.option.appVersion = resetOption.appVersion;
            this.option.buildVersion = resetOption.buildVersion;
            this.option.general = resetOption.general;
            this.option.notification = resetOption.notification;
            this.option.shortcuts.diver = resetOption.shortcuts.diver;
            this.option.shortcuts.interface = resetOption.shortcuts.interface;
            this.option.shortcuts.spell = resetOption.shortcuts.spell;
            this.option.shortcuts.item = resetOption.shortcuts.item;
            console.log('emit->reload-settings-done');
            this.ipcRendererService.send('reload-settings-done');
        });
    }
};
SettingsService = __decorate([
    core_1.Injectable(),
    __metadata("design:paramtypes", [ipcrenderer_service_1.IpcRendererService,
        core_1.NgZone])
], SettingsService);
exports.SettingsService = SettingsService;

//# sourceMappingURL=settings.service.js.map
