"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
const core_1 = require("@angular/core");
const ng_bootstrap_1 = require("@ng-bootstrap/ng-bootstrap");
const shared_module_1 = require("./../../shared/shared.module");
const update_routing_module_1 = require("./update-routing.module");
const update_component_1 = require("./update.component");
let UpdateModule = class UpdateModule {
};
UpdateModule = __decorate([
    core_1.NgModule({
        declarations: [update_component_1.UpdateComponent],
        imports: [
            shared_module_1.SharedModule,
            update_routing_module_1.UpdateRoutingModule,
            ng_bootstrap_1.NgbModule.forRoot()
        ],
    })
], UpdateModule);
exports.UpdateModule = UpdateModule;

//# sourceMappingURL=update.module.js.map
