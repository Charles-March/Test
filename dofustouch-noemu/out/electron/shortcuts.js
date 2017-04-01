"use strict";
const electronLocalshortcut = require('electron-localshortcut');
const settings = require('electron-settings');
const { app } = require('electron');
const async = require('async');
class ShortCuts {
    constructor(win) {
        this.win = win;
        this.isBinded = false;
    }
    bindAll() {
        async.forEachOf(settings.getSync('option.shortcuts.no_emu.tabs'), (shortcut, index) => {
            if (shortcut) {
                electronLocalshortcut.register(this.win, ShortCuts.convert(shortcut), () => {
                    this.win.webContents.send('switch-tab', index);
                });
            }
        });
    }
    reload() {
        // remove all bind
        electronLocalshortcut.unregisterAll(this.win);
        // bind again
        this.bindAll();
        // send IPC to the client
        console.log('emit->reload-shortcuts');
        this.win.webContents.send('reload-shortcuts');
    }
    enable() {
        if (!this.isBinded) {
            this.bindAll();
        }
        else {
            electronLocalshortcut.enableAll(this.win);
        }
    }
    disable() {
        electronLocalshortcut.disableAll(this.win);
    }
    static convert(shortcut) {
        shortcut = shortcut.replace('ctrl', 'CmdOrCtrl');
        return shortcut;
    }
}
exports.ShortCuts = ShortCuts;

//# sourceMappingURL=shortcuts.js.map
