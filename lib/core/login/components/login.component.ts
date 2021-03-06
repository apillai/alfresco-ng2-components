/*!
 * @license
 * Copyright 2016 Alfresco Software, Ltd.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import {
    Component,
    ElementRef,
    EventEmitter,
    Input,
    OnInit,
    Output,
    TemplateRef,
    ViewEncapsulation
} from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';

import { AuthenticationService } from '../../services/authentication.service';
import { LogService } from '../../services/log.service';
import { SettingsService } from '../../services/settings.service';
import { TranslationService } from '../../services/translation.service';
import { UserPreferencesService } from '../../services/user-preferences.service';

import { LoginErrorEvent } from '../models/login-error.event';
import { LoginSubmitEvent } from '../models/login-submit.event';
import { LoginSuccessEvent } from '../models/login-success.event';

enum LoginSteps {
    Landing = 0,
    Checking = 1,
    Welcome = 2
}

@Component({
    selector: 'adf-login',
    templateUrl: './login.component.html',
    styleUrls: ['./login.component.scss'],
    host: { '(blur)': 'onBlur($event)' },
    encapsulation: ViewEncapsulation.None
})
export class LoginComponent implements OnInit {

    isPasswordShow: boolean = false;

    @Input()
    showRememberMe: boolean = true;

    @Input()
    showLoginActions: boolean = true;

    @Input()
    needHelpLink: string = '';

    @Input()
    registerLink: string = '';

    @Input()
    logoImageUrl: string = './assets/images/alfresco-logo.svg';

    @Input()
    backgroundImageUrl: string = './assets/images/background.svg';

    @Input()
    copyrightText: string = '\u00A9 2016 Alfresco Software, Inc. All Rights Reserved.';

    @Input()
    providers: string;

    @Input()
    fieldsValidation: any;

    @Input()
    disableCsrf: boolean;

    @Input()
    successRoute: string = null;

    @Output()
    success = new EventEmitter<LoginSuccessEvent>();

    @Output()
    error = new EventEmitter<LoginErrorEvent>();

    @Output()
    executeSubmit = new EventEmitter<LoginSubmitEvent>();

    form: FormGroup;
    isError: boolean = false;
    errorMsg: string;
    actualLoginStep: any = LoginSteps.Landing;
    LoginSteps: any = LoginSteps;
    rememberMe: boolean = true;
    formError: { [id: string]: string };
    minLength: number = 2;
    footerTemplate: TemplateRef<any>;
    headerTemplate: TemplateRef<any>;
    data: any;

    private _message: { [id: string]: { [id: string]: string } };

    /**
     * Constructor
     * @param _fb
     * @param authService
     * @param settingsService
     * @param translate
     */
    constructor(private _fb: FormBuilder,
                private authService: AuthenticationService,
                private settingsService: SettingsService,
                private translateService: TranslationService,
                private logService: LogService,
                private elementRef: ElementRef,
                private router: Router,
                private userPreferences: UserPreferencesService) {
        this.initFormError();
        this.initFormFieldsMessages();
    }

    ngOnInit() {
        if (this.hasCustomFiledsValidation()) {
            this.form = this._fb.group(this.fieldsValidation);
        } else {
            this.initFormFieldsDefault();
            this.initFormFieldsMessagesDefault();
        }
        this.form.valueChanges.subscribe(data => this.onValueChanged(data));
    }

    /**
     * Method called on submit form
     * @param values
     * @param event
     */
    onSubmit(values: any) {

        if (!this.checkRequiredParams()) {
            return false;
        }

        this.settingsService.setProviders(this.providers);
        this.settingsService.csrfDisabled = this.disableCsrf;

        this.disableError();

        const args = new LoginSubmitEvent(this.form);
        this.executeSubmit.emit(args);

        if (args.defaultPrevented) {
            return false;
        } else {
            this.performLogin(values);
        }
    }

    /**
     * The method check the error in the form and push the error in the formError object
     * @param data
     */
    onValueChanged(data: any) {
        this.disableError();
        for (let field in this.formError) {
            if (field) {
                this.formError[field] = '';
                let hasError = (this.form.controls[field].errors && data[field] !== '') ||
                    (this.form.controls[field].dirty && !this.form.controls[field].valid);
                if (hasError) {
                    for (let key in this.form.controls[field].errors) {
                        if (key) {
                            this.formError[field] += this._message[field][key] + '';
                        }
                    }
                }
            }
        }
    }

    /**
     * Performe the login service
     * @param values
     */
    private performLogin(values: any) {
        this.actualLoginStep = LoginSteps.Checking;
        this.authService.login(values.username, values.password, this.rememberMe)
            .subscribe(
                (token: any) => {
                    const redirectUrl = this.authService.getRedirectUrl();

                    this.actualLoginStep = LoginSteps.Welcome;
                    this.userPreferences.setStoragePrefix(values.username);
                    this.success.emit(new LoginSuccessEvent(token, values.username, values.password));

                    if (redirectUrl) {
                        this.authService.setRedirectUrl(null);
                        this.router.navigate([redirectUrl]);
                    } else if (this.successRoute) {
                        this.router.navigate([this.successRoute]);
                    }
                },
                (err: any) => {
                    this.actualLoginStep = LoginSteps.Landing;
                    this.displayErrorMessage(err);
                    this.enableError();
                    this.error.emit(new LoginErrorEvent(err));
                },
                () => this.logService.info('Login done')
            );
    }

    /**
     * Check and display the right error message in the UI
     */
    private displayErrorMessage(err: any): void {

        if (err.error && err.error.crossDomain && err.error.message.indexOf('Access-Control-Allow-Origin') !== -1) {
            this.errorMsg = err.error.message;
        } else if (err.status === 403 && err.message.indexOf('Invalid CSRF-token') !== -1) {
            this.errorMsg = 'LOGIN.MESSAGES.LOGIN-ERROR-CSRF';
        } else if (err.status === 403 && err.message.indexOf('The system is currently in read-only mode') !== -1) {
            this.errorMsg = 'LOGIN.MESSAGES.LOGIN-ECM-LICENSE';
        } else {
            this.errorMsg = 'LOGIN.MESSAGES.LOGIN-ERROR-CREDENTIALS';

        }
    }

    /**
     * Check the require parameter
     * @returns {boolean}
     */
    private checkRequiredParams(): boolean {

        let isAllParamPresent: boolean = true;

        if (this.providers === undefined || this.providers === null || this.providers === '') {
            this.errorMsg = 'LOGIN.MESSAGES.LOGIN-ERROR-PROVIDERS';
            this.enableError();
            let messageProviders: any;
            messageProviders = this.translateService.get(this.errorMsg);
            this.error.emit(new LoginErrorEvent(messageProviders.value));
            isAllParamPresent = false;
        }

        return isAllParamPresent;
    }

    /**
     * Add a custom form error for a field
     * @param field
     * @param msg
     */
    public addCustomFormError(field: string, msg: string) {
        this.formError[field] += msg;
    }

    /**
     * Add a custom validation rule error for a field
     * @param field
     * @param ruleId - i.e. required | minlength | maxlength
     * @param msg
     */
    addCustomValidationError(field: string, ruleId: string, msg: string, params?: any) {
        if (params) {
            this.translateService.get(msg, params).subscribe((res: string) => {
                this._message[field][ruleId] = res;
            });
        } else {
            this._message[field][ruleId] = msg;
        }
    }

    /**
     * Display and hide the password value.
     */
    toggleShowPassword() {
        this.isPasswordShow = !this.isPasswordShow;
        this.elementRef.nativeElement.querySelector('#password').type = this.isPasswordShow ? 'text' : 'password';
    }

    /**
     * The method return if a field is valid or not
     * @param field
     * @returns {boolean}
     */
    isErrorStyle(field: AbstractControl) {
        return !field.valid && field.dirty && !field.pristine;
    }

    /**
     * Trim username
     */
    trimUsername(event: any) {
        event.target.value = event.target.value.trim();
    }

    /**
     * Default formError values
     */
    private initFormError() {
        this.formError = {
            'username': '',
            'password': ''
        };
    }

    /**
     * Init form fields messages
     */
    private initFormFieldsMessages() {
        this._message = {
            'username': {},
            'password': {}
        };
    }

    /**
     * Default form fields messages
     */
    private initFormFieldsMessagesDefault() {
        this._message = {
            'username': {
                'required': 'LOGIN.MESSAGES.USERNAME-REQUIRED'
            },
            'password': {
                'required': 'LOGIN.MESSAGES.PASSWORD-REQUIRED'
            }
        };

        this.translateService.get('LOGIN.MESSAGES.USERNAME-MIN', { minLength: this.minLength }).subscribe((res: string) => {
            this._message['username']['minlength'] = res;
        });
    }

    private initFormFieldsDefault() {
        this.form = this._fb.group({
            username: ['', Validators.required],
            password: ['', Validators.required]
        });
    }

    /**
     * Disable the error flag
     */
    private disableError() {
        this.isError = false;
        this.initFormError();
    }

    /**
     * Enable the error flag
     */
    private enableError() {
        this.isError = true;
    }

    private hasCustomFiledsValidation(): boolean {
        return this.fieldsValidation !== undefined;
    }
}
