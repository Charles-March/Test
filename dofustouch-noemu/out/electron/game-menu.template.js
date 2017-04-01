"use strict";
const electron_1 = require("electron");
const settings = require('electron-settings');
const shortcuts_1 = require("./shortcuts");
const option_window_1 = require("./option-window");
const changelog_window_1 = require("./changelog-window");
class GameMenuTemplate {
    static build(application) {
        const template = [
            {
                label: 'Document',
                submenu: [
                    {
                        label: 'Nouvelle Fenetre',
                        accelerator: shortcuts_1.ShortCuts.convert(settings.getSync('option.shortcuts.no_emu.new_window')),
                        click(item, focusedWindow) {
                            application.addWindow();
                        }
                    },
                    {
                        label: 'Nouveau Onglet',
                        accelerator: shortcuts_1.ShortCuts.convert(settings.getSync('option.shortcuts.no_emu.new_tab')),
                        click(item, focusedWindow) {
                            focusedWindow.webContents.send('new-tab', {});
                        }
                    },
                    {
                        type: 'separator'
                    },
                    {
                        label: 'Fermer La Fenetre',
                        accelerator: 'Shift+CmdOrCtrl+W',
                        click(item, focusedWindow) {
                            //Emulator.openGameWindow();
                            focusedWindow.close();
                        }
                    },
                    {
                        label: 'Fermer L\'Onglet',
                        accelerator: 'CmdOrCtrl+W',
                        click(item, focusedWindow) {
                            focusedWindow.webContents.send('close-tab', {});
                        }
                    },
                ]
            },
            {
                label: 'Edition',
                submenu: [
                    {
                        role: 'undo'
                    },
                    {
                        role: 'redo'
                    },
                    {
                        type: 'separator'
                    },
                    {
                        role: 'cut'
                    },
                    {
                        role: 'copy'
                    },
                    {
                        role: 'paste'
                    },
                    {
                        role: 'delete'
                    },
                    {
                        role: 'selectall'
                    }
                ]
            },
            {
                label: 'Vue',
                submenu: [
                    {
                        label: 'Recharger',
                        accelerator: 'CmdOrCtrl+R',
                        click(item, focusedWindow) {
                            if (focusedWindow)
                                focusedWindow.reload();
                        }
                    },
                    {
                        label: 'Outils Developpeur',
                        accelerator: process.platform === 'darwin' ? 'Alt+Command+I' : 'Ctrl+Shift+I',
                        click(item, focusedWindow) {
                            if (focusedWindow)
                                focusedWindow.webContents.toggleDevTools();
                        }
                    },
                    {
                        type: 'separator'
                    },
                    {
                        label: 'Réinitialiser le zoom',
                        role: 'resetzoom'
                    },
                    {
                        label: 'Zoom +',
                        role: 'zoomin'
                    },
                    {
                        label: 'Zoom -',
                        role: 'zoomout'
                    },
                    {
                        type: 'separator'
                    },
                    {
                        label: 'Mode Plein Écran',
                        role: 'togglefullscreen'
                    }
                ]
            },
            {
                label: 'Fenetre',
                submenu: [
                    {
                        label: 'Montret Onglet Précédent',
                        accelerator: shortcuts_1.ShortCuts.convert(settings.getSync('option.shortcuts.no_emu.prev_tab')),
                        click(item, focusedWindow) {
                            focusedWindow.webContents.send('switch-tab', 'prev');
                        }
                    },
                    {
                        label: 'Montret Onglet Suivant',
                        accelerator: shortcuts_1.ShortCuts.convert(settings.getSync('option.shortcuts.no_emu.next_tab')),
                        click(item, focusedWindow) {
                            focusedWindow.webContents.send('switch-tab', 'next');
                        }
                    },
                    {
                        type: 'separator'
                    },
                    {
                        'label': 'Activer le son',
                        click(item, focusedWindow) {
                            focusedWindow.webContents.setAudioMuted(false);
                        }
                    },
                    {
                        'label': 'Désactiver le son',
                        click(item, focusedWindow) {
                            focusedWindow.webContents.setAudioMuted(true);
                        }
                    },
                    {
                        type: 'separator'
                    },
                    {
                        role: 'minimize'
                    },
                    {
                        role: 'close'
                    }
                ]
            },
            {
                label: 'Paramètres',
                submenu: [
                    {
                        label: 'Options',
                        click(item, focusedWindow) {
                            option_window_1.OptionWindow.run(application);
                        }
                    },
                    {
                        label: 'Changelog',
                        click(item, focusedWindow) {
                            changelog_window_1.ChangeLogWindow.run(application);
                        }
                    }
                ]
            },
            {
                role: 'help',
                submenu: [
                    {
                        label: 'A propos',
                        click() {
                            require('electron').shell.openExternal('');
                        }
                    }
                ]
            }
        ];
        if (process.platform === 'darwin') {
            this.darwin(template);
        }
        return template;
    }
    static darwin(template) {
        template.unshift({
            label: electron_1.app.getName(),
            submenu: [
                {
                    role: 'about'
                },
                {
                    type: 'separator'
                },
                {
                    role: 'services',
                    submenu: []
                },
                {
                    type: 'separator'
                },
                {
                    role: 'hide'
                },
                {
                    role: 'hideothers'
                },
                {
                    role: 'unhide'
                },
                {
                    type: 'separator'
                },
                {
                    role: 'quit'
                }
            ]
        });
        // Edit menu.
        template[2].submenu.push({
            type: 'separator'
        }, {
            label: 'Speech',
            submenu: [
                {
                    role: 'startspeaking'
                },
                {
                    role: 'stopspeaking'
                }
            ]
        });
    }
}
exports.GameMenuTemplate = GameMenuTemplate;

//# sourceMappingURL=game-menu.template.js.map
