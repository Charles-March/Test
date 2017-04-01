import {Component, Optional, ViewEncapsulation, Inject, Input, NgZone} from '@angular/core';
import { SettingsService } from './../../../../shared/settings/settings.service';
import {ApplicationService} from "../../../../shared/electron/application.service";

import {Crypt} from "../../../utils/crypt";

@Component({
    selector: 'option-shortcuts-interface',
    templateUrl: 'app/option/vip/multi-account/multi-account.component.html',
    styleUrls: ['app/option/vip/multi-account/multi-account.component.css'],
    host: {}
})
export class MultiAccountComponent {

    private windows: {account_name_encrypted: string, password_encrypted: string}[][];
    private new_account: {account_name: string, password: string};
    private windowIndexNewAccount: number;
    private openedModifyAccount: {window_index: number, account_index: number};
    private newPasswordForm: {new_password: string, ancient_password: string};
    private wrongAncientPassword: boolean = false;
    private successModifyPassword: boolean = false;

    constructor(
        private settingsService: SettingsService,
        private applicationService: ApplicationService
    ) {
        this.windows = settingsService.option.vip.multiaccount.windows;
    }

    hasPassword() {
        return this.settingsService.option.vip.multiaccount.master_password != "";
    }

    // Call when activate or deactivate multi account option
    toggleMultiAccountActive() {
        // If we activate multi account option,
        // and the master password is not set : open the form to create one
        if (this.settingsService.option.vip.multiaccount.active && !this.hasPassword())
            this.openNewPasswordForm();
    }

    // Show the new password form
    openNewPasswordForm() {
        this.newPasswordForm = {
            new_password: "",
            ancient_password: ""
        };
    }

    // Delete the new password variable
    // Close the new password form
    resetNewPassword() {
        this.wrongAncientPassword = false;
        this.successModifyPassword = false;
        delete(this.newPasswordForm);

        if (this.settingsService.option.vip.multiaccount.active && !this.hasPassword())
            this.settingsService.option.vip.multiaccount.active = false;
    }

    // Display the "password modified" tip;
    // And hide it 5 second later
    timeoutModifyPassword() {
        this.successModifyPassword = true;
        setTimeout(() => {
            this.successModifyPassword = false;
        }, 5000);
    }

    // set the new password
    setNewPassword() {

        // If it is the first time we set the masterpassword
        if (!this.hasPassword() && this.newPasswordForm && this.newPasswordForm.new_password != "") {
            // the the password in the applicationService
            this.applicationService.masterpassword = this.newPasswordForm.new_password;
            // Save hashed password in settings
            this.settingsService.option.vip.multiaccount.master_password = Crypt.createHash(this.newPasswordForm.new_password);
            // Hide password form
            this.resetNewPassword();
            return;
        }

        // In case of error, reOpen password form,
        // Display "wrong ancient password" tip
        if (
            !this.newPasswordForm || 
            this.newPasswordForm.ancient_password == "" || 
            this.newPasswordForm.new_password == "" ||
            this.applicationService.masterpassword != this.newPasswordForm.ancient_password)
        {
            this.wrongAncientPassword = true;
            this.openNewPasswordForm();
            return;
        }

        // Retrieve windows in settings
        let windows = this.settingsService.option.vip.multiaccount.windows;

        // For every windows and accounts in settings,
        // Re-encrypt account names and password with the new master password
        for (let i in windows) {
            for (let j in windows[i]) {
                let account_name = Crypt.decrypt(windows[i][j].account_name_encrypted, this.applicationService.masterpassword);
                let password = Crypt.decrypt(windows[i][j].password_encrypted, this.applicationService.masterpassword);

                windows[i][j] = {
                    account_name_encrypted: Crypt.encrypt(account_name, this.newPasswordForm.new_password),
                    password_encrypted: Crypt.encrypt(password, this.newPasswordForm.new_password),
                }
            }
        }

        // Save changes in settings
        this.settingsService.option.vip.multiaccount.windows = windows;

        // Save the new master password
        this.settingsService.option.vip.multiaccount.master_password = Crypt.createHash(this.newPasswordForm.new_password);

        // Save Master password in the application service
        this.applicationService.masterpassword = this.newPasswordForm.new_password;

        // Close password form
        this.resetNewPassword();

        // Display "modifies password" tip
        this.timeoutModifyPassword();
    }

    // Close the "add account" form
    resetAddAccount() {
        delete(this.windowIndexNewAccount);
    }

    // Open the "add account" form for the right window
    openAddAccount(windowIndex: number) {
        this.resetModifyAccount();
        this.windowIndexNewAccount = windowIndex;
        this.new_account = {
            account_name: undefined,
            password: undefined
        };
    }

    // Add a new a account in settings
    addAccount() {
        this.resetModifyAccount();

        // If wrong new account
        if (!this.new_account || !this.new_account.account_name || !this.new_account.password) {
            this.resetAddAccount();
            return;
        }

        let windows = this.settingsService.option.vip.multiaccount.windows;

        windows[this.windowIndexNewAccount].push({
            account_name_encrypted: Crypt.encrypt(this.new_account.account_name, this.applicationService.masterpassword),
            password_encrypted: Crypt.encrypt(this.new_account.password, this.applicationService.masterpassword)
        });

        this.settingsService.option.vip.multiaccount.windows = windows;

        this.resetAddAccount();
    }

    // Delete the account from settings
    deleteAccount(windowIndex: number, accountIndex: number) {
        let windows = this.settingsService.option.vip.multiaccount.windows;

        windows[windowIndex].splice(accountIndex, 1);

        this.settingsService.option.vip.multiaccount.windows = windows;
    }

    // Close "modify account" form
    resetModifyAccount() {
        this.openedModifyAccount = {
            window_index: undefined,
            account_index: undefined
        };
    }

    // Open "modify account" form
    openModifyAccount(windowIndex: number, accountIndex: number, account_name_encrypted: string) {
        this.resetModifyAccount();
        this.resetAddAccount();
        
        this.openedModifyAccount = {
            window_index: windowIndex,
            account_index: accountIndex,
        };

        // Init account name to midify with the current account name
        this.new_account = {
            account_name: Crypt.decrypt(account_name_encrypted, this.applicationService.masterpassword),
            password: undefined
        };
    }

    // Modify an account
    modifyAccount(windowIndex: number, accountIndex: number) {
        this.resetModifyAccount();

        if (!this.new_account || !this.new_account.account_name || !this.new_account.password) {
            delete(this.windowIndexNewAccount);
            return;
        }
        
        let windows = this.settingsService.option.vip.multiaccount.windows;

        windows[windowIndex][accountIndex].account_name_encrypted = Crypt.encrypt(this.new_account.account_name, this.applicationService.masterpassword);
        windows[windowIndex][accountIndex].password_encrypted = Crypt.encrypt(this.new_account.password, this.applicationService.masterpassword);

        this.settingsService.option.vip.multiaccount.windows = windows;

        this.resetAddAccount();
    }

    // Add a window in settings
    addWindow() {
        this.resetModifyAccount();
        this.resetAddAccount();

        let windows = this.settingsService.option.vip.multiaccount.windows;

        windows.push([]);

        this.settingsService.option.vip.multiaccount.windows = windows;
    }

    // Delete a window from settings
    deleteWindow(windowIndex: number) {
        this.resetModifyAccount();
        this.resetAddAccount();

        let windows = this.settingsService.option.vip.multiaccount.windows;

        windows.splice(windowIndex, 1);

        if (windows.length == 0)
            this.windows.push([]);

        this.settingsService.option.vip.multiaccount.windows = windows;
    }

    // In order to use Crypt class in the template
    Crypt(): Crypt {
        return Crypt;
    }

}