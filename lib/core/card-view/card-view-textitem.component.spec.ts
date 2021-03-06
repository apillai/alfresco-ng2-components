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

import { HttpClientModule } from '@angular/common/http';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';
import { MatDatepickerModule, MatIconModule, MatInputModule, MatNativeDateModule } from '@angular/material';
import { By } from '@angular/platform-browser';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { CardViewTextItemModel } from '../models/card-view-textitem.model';
import { AppConfigService } from '../app-config/app-config.service';
import { CardViewUpdateService } from '../services/card-view-update.service';
import { LogService } from '../services/log.service';
import { TranslateLoaderService } from '../services/translate-loader.service';

import { CardViewTextItemComponent } from './card-view-textitem.component';

describe('CardViewTextItemComponent', () => {

    let fixture: ComponentFixture<CardViewTextItemComponent>;
    let component: CardViewTextItemComponent;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            imports: [
                HttpClientModule,
                FormsModule,
                NoopAnimationsModule,
                MatDatepickerModule,
                MatIconModule,
                MatInputModule,
                MatNativeDateModule,
                TranslateModule.forRoot({
                    loader: {
                        provide: TranslateLoader,
                        useClass: TranslateLoaderService
                    }
                })
            ],
            declarations: [
                CardViewTextItemComponent
            ],
            providers: [
                AppConfigService,
                CardViewUpdateService,
                LogService
            ]
        }).compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(CardViewTextItemComponent);
        component = fixture.componentInstance;
        component.property = new CardViewTextItemModel ({
            label: 'Text label',
            value: 'Lorem ipsum',
            key: 'textkey',
            default: 'FAKE-DEFAULT-KEY',
            editable: false
        });
    });

    afterEach(() => {
        fixture.destroy();
        TestBed.resetTestingModule();
    });

    it('should render the label and value', () => {
        fixture.detectChanges();

        let labelValue = fixture.debugElement.query(By.css('.adf-property-label'));
        expect(labelValue).not.toBeNull();
        expect(labelValue.nativeElement.innerText).toBe('Text label');

        let value = fixture.debugElement.query(By.css(`[data-automation-id="card-textitem-value-${component.property.key}"]`));
        expect(value).not.toBeNull();
        expect(value.nativeElement.innerText.trim()).toBe('Lorem ipsum');
    });

    it('should render the default as value if the value is empty and editable false', () => {
        component.property = new CardViewTextItemModel ({
            label: 'Text label',
            value: '',
            key: 'textkey',
            default: 'FAKE-DEFAULT-KEY',
            editable: false
        });
        fixture.detectChanges();

        let value = fixture.debugElement.query(By.css(`[data-automation-id="card-textitem-value-${component.property.key}"]`));
        expect(value).not.toBeNull();
        expect(value.nativeElement.innerText.trim()).toBe('FAKE-DEFAULT-KEY');
    });

    it('should render the default as value if the value is empty and editable true', () => {
        component.property = new CardViewTextItemModel ({
            label: 'Text label',
            value: '',
            key: 'textkey',
            default: 'FAKE-DEFAULT-KEY',
            editable: true
        });
        fixture.detectChanges();

        let value = fixture.debugElement.query(By.css(`[data-automation-id="card-textitem-value-${component.property.key}"]`));
        expect(value).not.toBeNull();
        expect(value.nativeElement.innerText.trim()).toBe('FAKE-DEFAULT-KEY');
    });

    it('should render the default as value if the value is empty and clickable false', () => {
        component.property = new CardViewTextItemModel ({
            label: 'Text label',
            value: '',
            key: 'textkey',
            default: 'FAKE-DEFAULT-KEY',
            clickable: false
        });
        fixture.detectChanges();

        let value = fixture.debugElement.query(By.css(`[data-automation-id="card-textitem-value-${component.property.key}"]`));
        expect(value).not.toBeNull();
        expect(value.nativeElement.innerText.trim()).toBe('FAKE-DEFAULT-KEY');
    });

    it('should render the default as value if the value is empty and clickable true', () => {
        component.property = new CardViewTextItemModel ({
            label: 'Text label',
            value: '',
            key: 'textkey',
            default: 'FAKE-DEFAULT-KEY',
            clickable: true
        });
        fixture.detectChanges();

        let value = fixture.debugElement.query(By.css(`[data-automation-id="card-textitem-value-${component.property.key}"]`));
        expect(value).not.toBeNull();
        expect(value.nativeElement.innerText.trim()).toBe('FAKE-DEFAULT-KEY');
    });

    it('should render value when editable:true', () => {
        component.editable = true;
        component.property.editable = true;
        fixture.detectChanges();

        let value = fixture.debugElement.query(By.css(`[data-automation-id="card-textitem-value-${component.property.key}"]`));
        expect(value).not.toBeNull();
        expect(value.nativeElement.innerText.trim()).toBe('Lorem ipsum');
    });

    it('should render the edit icon in case of editable:true', () => {
        component.editable = true;
        component.property.editable = true;
        fixture.detectChanges();

        let editIcon = fixture.debugElement.query(By.css(`[data-automation-id="card-textitem-edit-icon-${component.property.key}"]`));
        expect(editIcon).not.toBeNull('Edit icon should be shown');
    });

    it('should NOT render the edit icon in case of editable:false', () => {
        component.editable = false;
        fixture.detectChanges();

        let editIcon = fixture.debugElement.query(By.css(`[data-automation-id="card-textitem-edit-icon-${component.property.key}"]`));
        expect(editIcon).toBeNull('Edit icon should NOT be shown');
    });

    it('should NOT render the picker and toggle in case of editable:true but (general) editable:false', () => {
        component.editable = false;
        component.property.editable = true;
        fixture.detectChanges();

        let editIcon = fixture.debugElement.query(By.css(`[data-automation-id="card-textitem-edit-icon-${component.property.key}"]`));
        expect(editIcon).toBeNull('Edit icon should NOT be shown');
    });

    it('should trigger an update event on the CardViewUpdateService', (done) => {
        component.editable = true;
        component.property.editable = true;
        const cardViewUpdateService = TestBed.get(CardViewUpdateService);
        const expectedText = 'changed text';
        fixture.detectChanges();

        cardViewUpdateService.itemUpdated$.subscribe(
            (updateNotification) => {
                expect(updateNotification.target).toBe(component.property);
                expect(updateNotification.changed).toEqual({ textkey: expectedText });
                done();
            }
        );

        let editIcon = fixture.debugElement.query(By.css(`[data-automation-id="card-textitem-edit-toggle-${component.property.key}"]`));
        editIcon.triggerEventHandler('click', null);
        fixture.detectChanges();

        let editInput = fixture.debugElement.query(By.css(`[data-automation-id="card-textitem-editinput-${component.property.key}"]`));
        editInput.nativeElement.value = expectedText;
        editInput.nativeElement.dispatchEvent(new Event('input'));
        fixture.detectChanges();

        let updateInput = fixture.debugElement.query(By.css(`[data-automation-id="card-textitem-update-${component.property.key}"]`));
        updateInput.triggerEventHandler('click', null);
    });

    it('should switch back to readonly mode after an update attempt', async(() => {
        component.editable = true;
        component.property.editable = true;
        component.inEdit = true;
        component.editedValue = 'updated-value';
        fixture.detectChanges();

        component.update();

        fixture.whenStable().then(() => {
            expect(component.property.value).toBe(component.editedValue);
            expect(component.inEdit).toBeFalsy();
        });
    }));
});
