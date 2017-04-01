"use strict";
const router_1 = require("@angular/router");
const option_component_1 = require("./option.component");
const general_component_1 = require("./general/general.component");
const shortcuts_component_1 = require("./shortcuts/shortcuts.component");
const no_emu_component_1 = require("./shortcuts/no-emu/no-emu.component");
const diver_component_1 = require("./shortcuts/diver/diver.component");
const spell_component_1 = require("./shortcuts/spell/spell.component");
const item_component_1 = require("./shortcuts/item/item.component");
const interface_component_1 = require("./shortcuts/interface/interface.component");
const notification_component_1 = require("./notification/notification.component");
const routes = [
    {
        path: '',
        component: option_component_1.OptionComponent,
        children: [
            { path: '', redirectTo: 'general', pathMatch: 'full' },
            { path: 'general', component: general_component_1.GeneralComponent },
            {
                path: 'shortcuts',
                component: shortcuts_component_1.ShortcutsComponent,
                children: [
                    { path: '', redirectTo: 'no-emu', pathMatch: 'full' },
                    { path: 'no-emu', component: no_emu_component_1.NoEmuComponent },
                    { path: 'diver', component: diver_component_1.DiverComponent },
                    { path: 'spell', component: spell_component_1.SpellComponent },
                    { path: 'item', component: item_component_1.ItemComponent },
                    { path: 'interface', component: interface_component_1.InterfaceComponent }
                ]
            },
            { path: 'notification', component: notification_component_1.NotificationComponent },
        ]
    }
];
exports.OptionRoutingModule = router_1.RouterModule.forChild(routes);

//# sourceMappingURL=option.routing.js.map
