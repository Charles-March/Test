import {ISettings} from "../../shared/settings";
import {DefaultSettings} from '../default.settings';
const settings = require('electron-settings');

export function checkSettings(){
    let sett:ISettings = settings.getSync();

    /*if(Number.isInteger(sett.alertCounter)
        && sett.appVersion
        && sett.buildVersion
        && typeof(sett.option.general.hidden_shop) === "boolean"
        && typeof(sett.option.general.hidden_tabs) === "boolean"
        && typeof(sett.option.general.developper_mode) === "boolean"
        && typeof(sett.option.general.stay_connected) === "boolean"
        && Number.isInteger(sett.option.general.resolution.x)
        && Number.isInteger(sett.option.general.resolution.y)
        && typeof(sett.option.shortcuts.no_emu.new_tab) === "string"
        && typeof(sett.option.shortcuts.no_emu.new_window) === "string"
        && typeof(sett.option.shortcuts.no_emu.next_tab) === "string"
        && typeof(sett.option.shortcuts.no_emu.prev_tab) === "string"
        && typeof(sett.option.shortcuts.no_emu.activ_tab) === "string"
        && Array.isArray(sett.option.shortcuts.no_emu.tabs)
        && typeof(sett.option.shortcuts.diver.end_turn) === "string"
        && typeof(sett.option.shortcuts.diver.open_chat) === "string"
        && Array.isArray(sett.option.shortcuts.spell)
        && Array.isArray(sett.option.shortcuts.item)
        && typeof(sett.option.shortcuts.interface.carac) === "string"
        && typeof(sett.option.shortcuts.interface.spell) === "string"
        && typeof(sett.option.shortcuts.interface.bag) === "string"
        && typeof(sett.option.shortcuts.interface.bidhouse) === "string"
        && typeof(sett.option.shortcuts.interface.map) === "string"
        && typeof(sett.option.shortcuts.interface.friend) === "string"
        && typeof(sett.option.shortcuts.interface.book) === "string"
        && typeof(sett.option.shortcuts.interface.guild) === "string"
        && typeof(sett.option.shortcuts.interface.conquest) === "string"
        && typeof(sett.option.shortcuts.interface.job) === "string"
        && typeof(sett.option.shortcuts.interface.alliance) === "string"
        && typeof(sett.option.shortcuts.interface.mount) === "string"
        && typeof(sett.option.shortcuts.interface.directory) === "string"
        && typeof(sett.option.shortcuts.interface.alignement) === "string"
        && typeof(sett.option.shortcuts.interface.bestiary) === "string"
        && typeof(sett.option.shortcuts.interface.title) === "string"
        && typeof(sett.option.shortcuts.interface.achievement) === "string"
        && typeof(sett.option.shortcuts.interface.almanax) === "string"
        && typeof(sett.option.shortcuts.interface.spouse) === "string"
        && typeof(sett.option.shortcuts.interface.shop) === "string"
        && typeof(sett.option.shortcuts.interface.goultine) === "string"
        && typeof(sett.option.notification.private_message) === "boolean"
        && typeof(sett.option.notification.fight_turn) === "boolean"
        && typeof(sett.option.notification.tax_collector) === "boolean"
        ){
        console.log('check settings OK');
        return true;
    }*/

    function checkRecursive(settings: any, defaultSettings: any) {
        for (var id in defaultSettings) {
            if (Array.isArray(defaultSettings[id])) {
                if (!Array.isArray(settings[id])) return false;
            }
            else {
                if (typeof defaultSettings[id] !== typeof settings[id] && defaultSettings[id] !== null) return false;
            }
            if (typeof defaultSettings[id] === 'object') {
                if (!checkRecursive(settings[id], defaultSettings[id])) return false;
            }
        }
        return true;
    }
    let ok = checkRecursive(sett, DefaultSettings);


    sett.alertCounter = Math.floor(sett.alertCounter);

    if(!sett.option.general.resolution.x || !sett.option.general.resolution.y){
        ok = false;
    }else{
        sett.option.general.resolution.x = Math.floor(sett.option.general.resolution.x);
        sett.option.general.resolution.y = Math.floor(sett.option.general.resolution.y);
    }

    if (ok) console.log('check settings OK');
    else console.log('check settings FAILED');


    return ok;
}
