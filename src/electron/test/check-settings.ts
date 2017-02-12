import {ISettings} from "../../shared/settings";
const settings = require('electron-settings');

export function checkSettings(){
    let sett:ISettings = settings.getSync();

    if(Number.isInteger(sett.alertCounter)
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
    }

    console.log('check settings FAILED');
    return false;
}
