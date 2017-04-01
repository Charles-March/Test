//interface Window { key: Keymaster; }
"use strict";
class ShortCuts {
    constructor(window) {
        this.shortcuts = [];
        this.window = window;
    }
    bind(shortcut, action) {
        this.window.key(shortcut, () => {
            action();
        });
        this.shortcuts.push(shortcut);
    }
    unBindAll() {
        this.shortcuts.forEach((shortcut) => {
            this.unBind(shortcut);
        });
    }
    unBind(shortcut) {
        this.window.key.unbind(shortcut);
        /*let index = this.shortcuts.indexOf(shortcut);

        if(index !== -1){
            this.shortcuts.splice(index, 1);
        }*/
    }
}
exports.ShortCuts = ShortCuts;

//# sourceMappingURL=shortcuts.js.map
