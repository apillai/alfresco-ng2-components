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

import { ModuleWithProviders } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard, AuthGuardBpm, AuthGuardEcm } from '@alfresco/adf-core';
import { AppLayoutComponent } from './components/app-layout/app-layout.component';
import { LoginComponent } from './components/login/login.component';
import { SettingsComponent } from './components/settings/settings.component';
import { HomeComponent } from './components/home/home.component';
import { AboutComponent } from './components/about/about.component';
import { ProcessServiceComponent } from './components/process-service/process-service.component';
import { ShowDiagramComponent } from './components/process-service/show-diagram.component';
import { FormViewerComponent } from './components/process-service/form-viewer.component';
import { FormNodeViewerComponent } from './components/process-service/form-node-viewer.component';
import { AppsViewComponent } from './components/process-service/apps-view.component';
import { SearchResultComponent } from './components/search/search-result.component';

import { DataTableComponent } from './components/datatable/datatable.component';
import { WebscriptComponent } from './components/webscript/webscript.component';
import { TagComponent } from './components/tag/tag.component';
import { SocialComponent } from './components/social/social.component';
import { FilesComponent } from './components/files/files.component';
import { FormComponent } from './components/form/form.component';

import { UploadButtonComponent } from '@alfresco/adf-content-services';
import { FileViewComponent } from './components/file-view/file-view.component';
import { CustomSourcesComponent } from './components/files/custom-sources.component';
import { FormListComponent } from './components/form/form-list.component';
import { OverlayViewerComponent } from './components/overlay-viewer/overlay-viewer.component';

export const appRoutes: Routes = [
    { path: 'login', component: LoginComponent },
    { path: 'settings', component: SettingsComponent },
    { path: 'files/:nodeId/view', component: FileViewComponent, canActivate: [ AuthGuardEcm ] },
    {
        path: '',
        component: AppLayoutComponent,
        canActivate: [AuthGuard],
        children: [
            {
                path: '',
                component: HomeComponent
            },
            {
                path: 'home',
                component: HomeComponent
            }
            ,
            {
                path: 'files',
                component: FilesComponent,
                canActivate: [AuthGuardEcm]
            },
            {
                path: 'files/:id',
                component: FilesComponent,
                canActivate: [AuthGuardEcm]
            },
            {
                path: 'dl-custom-sources',
                component: CustomSourcesComponent,
                canActivate: [AuthGuardEcm]
            },
            {
                path: 'datatable',
                component: DataTableComponent
            },
            {
                path: 'uploader',
                component: UploadButtonComponent,
                canActivate: [AuthGuardEcm]
            },
            {
                path: 'search',
                component: SearchResultComponent,
                canActivate: [AuthGuardEcm]
            },
            {
                path: 'activiti',
                component: AppsViewComponent,
                canActivate: [AuthGuardBpm]
            },
            {
                path: 'activiti/apps',
                component: AppsViewComponent,
                canActivate: [AuthGuardBpm]
            },
            {
                path: 'activiti/apps/:appId/tasks',
                component: ProcessServiceComponent,
                canActivate: [AuthGuardBpm]
            },
            {
                path: 'activiti/apps/:appId/processes',
                component: ProcessServiceComponent,
                canActivate: [AuthGuardBpm]
            },
            {
                path: 'activiti/apps/:appId/diagram/:processDefinitionId',
                component: ShowDiagramComponent,
                canActivate: [AuthGuardBpm]
            },
            // TODO: check if neeeded
            {
                path: 'activiti/appId/:appId',
                component: ProcessServiceComponent,
                canActivate: [AuthGuardBpm]
            },
            // TODO: check if needed
            {
                path: 'activiti/tasks/:id',
                component: FormViewerComponent,
                canActivate: [AuthGuardBpm]
            },
            // TODO: check if needed
            {
                path: 'activiti/tasksnode/:id',
                component: FormNodeViewerComponent,
                canActivate: [AuthGuardBpm]
            },
            {
                path: 'webscript',
                component: WebscriptComponent,
                canActivate: [AuthGuardEcm]
            },
            {
                path: 'tag',
                component: TagComponent,
                canActivate: [AuthGuardEcm]
            },
            {
                path: 'social',
                component: SocialComponent,
                canActivate: [AuthGuardEcm]
            },
            { path: 'about', component: AboutComponent },
            { path: 'form', component: FormComponent },
            { path: 'form-list', component: FormListComponent },
            {
                path: 'overlay-viewer',
                component: OverlayViewerComponent,
                canActivate: [AuthGuardEcm]
            }
        ]
    }
];

export const routing: ModuleWithProviders = RouterModule.forRoot(appRoutes);
