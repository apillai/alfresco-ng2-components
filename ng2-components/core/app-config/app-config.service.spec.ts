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
import { inject, TestBed } from '@angular/core/testing';
import { AppConfigService } from './app-config.service';
import { AppConfigModule } from './app-config.module';

declare let jasmine: any;

describe('AppConfigService', () => {

    let appConfigService: AppConfigService;

    const mockResponse = {
        ecmHost: 'http://localhost:4000/ecm',
        bpmHost: 'http://localhost:4000/ecm',
        application: {
            name: 'Custom Name'
        },
        files: {
            'excluded': ['exluded']
        }
    };

    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [
                HttpClientModule,
                AppConfigModule
            ],
            providers: [
            ]
        });

        jasmine.Ajax.install();
    });

    beforeEach(
        inject([AppConfigService], (appConfig: AppConfigService) => {
            appConfigService = appConfig;

            jasmine.Ajax.requests.mostRecent().respondWith({
                'status': 200,
                contentType: 'application/json',
                responseText: JSON.stringify(mockResponse)
            });
        })
    );

    afterEach(() => {
        jasmine.Ajax.uninstall();
    });

    it('should export service in the module', () => {
        expect(appConfigService).toBeDefined();
    });

    it('should skip the optional port number', () => {
        appConfigService.config.testUrl = 'http://{hostname}{:port}';

        spyOn(appConfigService, 'getLocationHostname').and.returnValue('localhost');
        spyOn(appConfigService, 'getLocationPort').and.returnValue('');

        expect(appConfigService.get('testUrl')).toBe('http://localhost');
    });

    it('should set the optional port number', () => {
        appConfigService.config.testUrl = 'http://{hostname}{:port}';

        spyOn(appConfigService, 'getLocationHostname').and.returnValue('localhost');
        spyOn(appConfigService, 'getLocationPort').and.returnValue(':9090');

        expect(appConfigService.get('testUrl')).toBe('http://localhost:9090');
    });

    it('should set the mandatory port number', () => {
        appConfigService.config.testUrl = 'http://{hostname}:{port}';

        spyOn(appConfigService, 'getLocationHostname').and.returnValue('localhost');
        spyOn(appConfigService, 'getLocationPort').and.returnValue('9090');

        expect(appConfigService.get('testUrl')).toBe('http://localhost:9090');
    });

    it('should load external settings', () => {
        appConfigService.load().then(config => {
            expect(config).toEqual(mockResponse);
        });
    });

    it('should retrieve settings', () => {
        appConfigService.load().then(() => {
            expect(appConfigService.get('ecmHost')).toBe(mockResponse.ecmHost);
            expect(appConfigService.get('bpmHost')).toBe(mockResponse.bpmHost);
            expect(appConfigService.get('application.name')).toBe(mockResponse.application.name);
        });
    });

    it('should take excluded file list', () => {
        appConfigService.load().then(() => {
            expect(appConfigService.get('files.excluded')[0]).toBe('exluded');
        });
    });
});
