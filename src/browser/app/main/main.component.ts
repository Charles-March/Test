import {
    Component, Optional, ViewEncapsulation, Inject, OnInit, NgZone, SimpleChanges, ViewChild,
    AfterViewInit, TemplateRef
} from '@angular/core';
import {TranslateService} from 'ng2-translate';
import {NgbModal, ModalDismissReasons} from '@ng-bootstrap/ng-bootstrap';
import {TabService} from './tab/tab.service';
import {Tab} from './tab/tab';
import {ShortCuts} from './../shortcuts/shortcuts';
import {IpcRendererService} from './../../shared/electron/ipcrenderer.service';
import {ApplicationService} from "../../shared/electron/application.service";
import {SettingsService} from "../../shared/settings/settings.service";
import {Title} from "@angular/platform-browser";
import {NeutrinoService} from "../../shared/electron/neutrino.service";
import {Http} from "@angular/http";

const {shell} = (<any>global).nodeRequire('electron').remote;

interface INews {
    author: string;
    content: string;
    date: string;
    id: number;
    image: string;
    title: string;
    display: boolean;
}

//const { ipcRenderer } = (<any>global).nodeRequire('electron');

@Component({
    selector: 'main',
    templateUrl: 'app/main/main.component.html',
    styleUrls: ['app/main/main.component.css'],
    host: {
        "style": "height:100%; overflow: hidden; background: black;" // find something less ugly in future
    }
})
export class MainComponent implements OnInit, AfterViewInit {
    tabs: Array<Tab>;
    activTab: Tab = null;

    private news: Array<INews> = [];

    @ViewChild('tipeeeContent') tipeeeContent: TemplateRef<any>;
    @ViewChild('newsContent') newsContent: TemplateRef<any>;

    constructor(@Inject('Window') private window: Window,
                private translate: TranslateService,
                private modalService: NgbModal,
                private tabService: TabService,
                private ipcRendererService: IpcRendererService,
                private settingsService: SettingsService,
                private applicationService: ApplicationService,
                private neutrinoService: NeutrinoService,
                private http: Http,
                private titleService: Title) {

        (<any>this.window).appVersion = this.applicationService.appVersion;
        (<any>this.window).buildVersion = this.applicationService.buildVersion;
    }

    ngOnInit(): void {
        this.titleService.setTitle('DofusTouch No-Emu');

        this.tabs = this.tabService.getTabs();

        this.setEventListener();

        this.addTab();
    }

    ngAfterViewInit() {

        if (!this.checkTipeee()) {
            this.checkNews();
        }


        this.ipcRendererService.on('open-news', () => {
            this.displayNews();
        });

        this.settingsService.alertCounter++;
    }

    displayNews() {
        this.http.get(`${this.applicationService.website}/news.json`)
            .map(res => res.json().feed)
            .subscribe((news: Array<INews>) => {

                this.news = news;

                this.modalService.open(this.newsContent, {size: 'lg'}).result.then((result) => {

                }, (reason) => {

                });
            });
    }

    checkNews() {

        this.http.get(`${this.applicationService.website}/news.json`)
            .map(res => res.json().feed)
            .subscribe((news: Array<INews>) => {

                let last_news = Math.max.apply(Math, news.map(function (n) {
                    return n.id;
                }));

                if (this.settingsService.last_news != last_news) {
                    this.settingsService.last_news = last_news;

                    this.displayNews();
                }
            });

    }

    checkTipeee(): boolean {
        if (this.settingsService.alertCounter % 15 === 0) {
            this.modalService.open(this.tipeeeContent, {}).result.then((result) => {

            }, (reason) => {

            });

            return true;
        } else {
            return false;
        }
    }


    addTab(): void {
        let tab: Tab = new Tab();
        this.tabService.addTab(tab);

        this.selectTab(tab);
    }

    removeTab(tab: Tab): void {

        if (this.activTab !== null && tab.id === this.activTab.id) {
            this.activTab = null;
            //let newTab = this.tabService.getNearTab(tab);
            //this.selectTab(newTab.id)
        }

        this.tabService.removeTab(tab);
    }

    setEventListener(): void {

        // ipc new tab
        this.ipcRendererService.on('new-tab', (event: Event) => {
            this.addTab();
        });

        // ipc close tab
        this.ipcRendererService.on('close-tab', (event: Event) => {
            this.removeTab(this.activTab);
        });

        // ipc switch tab
        this.ipcRendererService.on('switch-tab', (event: Event, action: string | number) => {

            if ((<any>Number).isInteger(action)) {
                if (typeof this.tabs[action] !== 'undefined') {
                    this.selectTab(this.tabs[action]);
                }
            } else {
                let index = this.tabs.indexOf(this.activTab);
                switch (action) {
                    case 'prev':
                        if (index !== -1) {
                            if (index === 0) {
                                this.selectTab(this.tabs[this.tabs.length - 1]);
                            } else {
                                this.selectTab(this.tabs[index - 1]);
                            }
                        }
                        break;
                    case 'next':
                        if (index !== -1) {
                            if (index === (this.tabs.length - 1)) {
                                this.selectTab(this.tabs[0]);
                            } else {
                                this.selectTab(this.tabs[index + 1]);
                            }
                        }
                        break;
                }
            }
        });
    }

    selectTab(tab: Tab): void {

        // remove old activTab
        if (this.activTab !== null) {
            this.activTab.isFocus = false;
        }

        // set the new one
        this.activTab = tab;

        // add focus and remove noitification
        this.activTab.isFocus = true;
        this.activTab.notification = false;

        //focus the iframe
        if (this.activTab.isLogged) {
            this.activTab.window.focus();
        }

        // change the name of the windows
        if (this.activTab.isLogged) {
            this.titleService.setTitle(this.activTab.character);
        }

    }

    tipeee() {
        this.neutrinoService.emit("TIPEEE");
        shell.openExternal('https://www.tipeee.com/dtne');
    }
}
