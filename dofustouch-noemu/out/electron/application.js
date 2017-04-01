"use strict";
const changelog_window_1 = require("./changelog-window");
const settings = require('electron-settings');
const electron_1 = require("electron");
const request = require("request");
const default_settings_1 = require("./default.settings");
const game_window_1 = require("./game-window");
const update_window_1 = require("./update-window");
class Application {
    constructor(cmdOptions) {
        this.website = "http://dofustouch.no-emu.com";
        this.devMode = false;
        this.gameWindows = [];
        // set defaults settings
        settings.defaults(default_settings_1.DefaultSettings);
        // if wrong settings -> reset
        if (!settings.getSync('buildVersion')) {
            settings.resetToDefaultsSync(); // debug
        }
        this.cmdOptions = cmdOptions;
        this.devMode = cmdOptions.devmode;
        this.updateWindow = new update_window_1.UpdateWindow(this);
    }
    getAppVersion() {
        return new Promise((resolve, reject) => {
            request('https://itunes.apple.com/lookup?id=1041406978', function (error, response, body) {
                if (!error && response.statusCode == 200) {
                    let bodyParse = JSON.parse(body);
                    resolve(bodyParse.results[0].version);
                }
                else {
                    reject(error);
                }
            });
        });
    }
    getBuildVersion() {
        return new Promise((resolve, reject) => {
            request('https://proxyconnection.touch.dofus.com/build/script.js', (error, response, body) => {
                if (!error && response.statusCode == 200) {
                    const regex = /.*buildVersion=("|')([0-9]*\.[0-9]*\.[0-9]*)("|')/g;
                    let m;
                    m = regex.exec(body.substring(1, 10000));
                    resolve(m[2]);
                }
                else {
                    reject(error);
                }
            });
        });
    }
    run() {
        // get dynamic app and build version (avoid login block)
        Promise.all([
            this.getAppVersion(),
            this.getBuildVersion(),
        ]).then(([newAppVersion, newBuildVersion]) => {
            settings.setSync('option.appVersion', newAppVersion);
            this.updateWindow.run().then(() => {
                this.addWindow();
                this.updateWindow.win.close();
                if (this.cmdOptions.changelog) {
                    changelog_window_1.ChangeLogWindow.run(this);
                }
            });
            // this.addWindow();
            electron_1.ipcMain.on('load-config', (event, arg) => {
                let appPath = electron_1.app.getAppPath();
                if (this.cmdOptions.devmode) {
                    appPath = __dirname + '/../../';
                }
                event.returnValue = {
                    gamePath: electron_1.app.getPath('userData') + '/game',
                    appPath: appPath,
                    buildVersion: newBuildVersion,
                    appVersion: newAppVersion
                };
            });
        });
    }
    reloadSettings() {
        this.gameWindows.forEach((gWindow) => {
            //gWindow.shortCuts.reload();
            gWindow.reloadSettings();
        });
    }
    addWindow() {
        // instance window game
        let gWindow = new game_window_1.GameWindow(this);
        // start the game window
        gWindow.run();
        // add event listenner closed
        gWindow.closed((e) => {
            delete this.gameWindows[this.gameWindows.indexOf(e)];
        });
        // add the game window
        this.gameWindows.push(gWindow);
    }
}
exports.Application = Application;

//# sourceMappingURL=application.js.map
