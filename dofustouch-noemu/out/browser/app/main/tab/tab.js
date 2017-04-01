"use strict";
class Tab {
    constructor() {
        this.id = Tab.seqId++;
        this.character = null;
        this.isLogged = false;
        this.isFocus = false;
        this.window = null;
        this.notification = false;
    }
}
Tab.seqId = 1;
exports.Tab = Tab;

//# sourceMappingURL=tab.js.map
