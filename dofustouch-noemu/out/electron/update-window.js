"use strict";
const request = require("request");
const pkg = require('./../../package.json');
const settings = require('electron-settings');
const extract = require('extract-zip');
const electron = require("electron");
const electron_1 = require("electron");
const url = require("url");
class UpdateWindow {
    constructor(application) {
        this.application = application;
    }
    createWindow() {
        let window = new electron.BrowserWindow({
            width: 800,
            height: 150,
            resizable: false,
            center: true,
            parent: electron.BrowserWindow.getFocusedWindow(),
            darkTheme: true,
            skipTaskbar: true,
            show: true,
            modal: true
        });
        window.on('closed', () => {
            window = null;
        });
        return window;
    }
    openUpdateModal(response) {
        return new Promise((resolve, reject) => {
            let message = 'Une nouvelle version de DOFUS Touch No-Emu est disponible, vous pouvez la télécharger depuis notre site!\n';
            let buttons = ['Se rendre sur le site'];
            if (!response.noemu.required) {
                buttons.push('Ignorer');
            }
            else {
                message = 'Une nouvelle version obligatoire de DOFUS Touch No-Emu est disponible, vous pouvez la télécharger sur notre site.';
            }
            electron_1.dialog.showMessageBox(electron_1.BrowserWindow.getFocusedWindow(), {
                type: 'info',
                title: 'Nouvelle version : ' + response.noemu.version,
                message: message,
                buttons: buttons,
            }, (buttonIndex) => {
                if (buttonIndex == 0) {
                    electron_1.shell.openExternal("http://dofustouch.no-emu.com/#download");
                    electron_1.app.exit();
                }
                else {
                    resolve();
                }
            });
        });
    }
    checkNoEmuUpdate(response) {
        return new Promise((resolve, reject) => {
            console.log(pkg.version);
            if (pkg.version == response.noemu.version) {
                console.log('No-Emu is already up to date');
                resolve(response);
            }
            else {
                switch (process.platform) {
                    case 'darwin':
                    case 'linux':
                    case 'win32':
                        this.openUpdateModal(response).then(() => {
                            resolve(response);
                        });
                        break;
                }
            }
        });
    }
    checkGameUpdate(response) {
        return new Promise((resolve, reject) => {
            if (settings.getSync('buildVersion') == response.dofustouch.version) {
                console.log('Game is already up to date');
                resolve();
            }
            else {
                this.win = this.createWindow();
                let savePath = electron_1.app.getPath('userData') + '/game.zip';
                let remoteUrl = response.dofustouch.file;
                this.win.loadURL(`file://${__dirname}/../browser/index.html#/update/${encodeURIComponent(savePath)}/${encodeURIComponent(remoteUrl)}`);
                if (this.application.devMode) {
                    this.win.webContents.openDevTools();
                }
                electron_1.ipcMain.on('install-update', (event, arg) => {
                    console.log('ready to update');
                    extract(savePath, { dir: electron_1.app.getPath('userData') + '/game' }, function (err) {
                        console.log('extract finish');
                        settings.setSync('buildVersion', response.dofustouch.version);
                        resolve();
                    });
                });
            }
        });
    }
    run() {
        return new Promise((resolve, reject) => {
            this.retrieveUpdate().then((response) => {
                return this.checkNoEmuUpdate(response);
            }).then((response) => {
                return this.checkGameUpdate(response);
            }).then(() => {
                resolve();
            });
        });
    }
    retrieveUpdate() {
        return new Promise((resolve, reject) => {
            let queries = '?version=' + settings.getSync('option.buildVersion') + '&os=' + process.platform;
            request(url.resolve(this.application.website, 'update/game.php' + queries), (error, response, body) => {
                if (!error && response.statusCode == 200) {
                    let parseBody = JSON.parse(body);
                    resolve(parseBody);
                }
                else {
                    reject(error);
                }
            });
        });
    }
}
exports.UpdateWindow = UpdateWindow;

//# sourceMappingURL=update-window.js.map
