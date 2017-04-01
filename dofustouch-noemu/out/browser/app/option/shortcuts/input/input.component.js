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
const keycode_1 = require("./keycode");
//const { ipcRenderer } = (<any>global).nodeRequire('electron');
let InputComponent = class InputComponent {
    constructor() {
        this.modelChange = new core_1.EventEmitter();
        this._keys = [];
    }
    keyDown(event) {
        event.preventDefault();
        this._keys.forEach((key, index) => {
            if (key == event.keyCode) {
                delete this._keys[index];
            }
        });
        this._keys.push(event.keyCode);
        let first = true;
        let shortcut = '';
        this._keys.forEach((key) => {
            if (this._keys.length > 1 && !first) {
                shortcut += '+';
            }
            console.log(key);
            shortcut += keycode_1.KeyCode.getKeyCodeValue(key, false);
            first = false;
        });
        this.model = shortcut;
        this.modelChange.emit(this.model);
    }
    keyUp(event) {
        delete this._keys[this._keys.indexOf(event.keyCode)];
    }
    erase() {
        this.model = '';
        this.modelChange.emit(this.model);
    }
};
__decorate([
    core_1.Input(),
    __metadata("design:type", String)
], InputComponent.prototype, "name", void 0);
__decorate([
    core_1.Input(),
    __metadata("design:type", String)
], InputComponent.prototype, "id", void 0);
__decorate([
    core_1.Input(),
    __metadata("design:type", Object)
], InputComponent.prototype, "model", void 0);
__decorate([
    core_1.Output(),
    __metadata("design:type", core_1.EventEmitter)
], InputComponent.prototype, "modelChange", void 0);
InputComponent = __decorate([
    core_1.Component({
        selector: 'option-shortcuts-input',
        templateUrl: 'app/option/shortcuts/input/input.component.html',
        styleUrls: ['app/option/shortcuts/input/input.component.css'],
        host: {}
    }),
    __metadata("design:paramtypes", [])
], InputComponent);
exports.InputComponent = InputComponent;

//# sourceMappingURL=input.component.js.map
