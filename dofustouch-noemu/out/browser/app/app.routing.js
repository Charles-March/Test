"use strict";
const router_1 = require("@angular/router");
const routes = [
    {
        path: '', redirectTo: 'main', pathMatch: 'full'
    },
    {
        path: 'option',
        loadChildren: './app/option/option.module#OptionModule'
    },
    {
        path: 'changelog',
        loadChildren: './app/changelog/changelog.module#ChangeLogModule'
    },
    {
        path: 'update',
        loadChildren: './app/update/update.module#UpdateModule'
    },
    {
        path: 'main',
        loadChildren: './app/main/main.module#MainModule'
    },
];
exports.routing = router_1.RouterModule.forRoot(routes, { useHash: true });

//# sourceMappingURL=app.routing.js.map
