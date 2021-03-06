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

import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot } from '@angular/router';
import { AlfrescoApiService } from './alfresco-api.service';
import { AuthenticationService } from './authentication.service';

@Injectable()
export class AuthGuardEcm implements CanActivate {
    constructor(
        private authService: AuthenticationService,
        private apiService: AlfrescoApiService,
        private router: Router) {
    }

    private get authApi() {
        return this.apiService.getInstance().ecmAuth;
    }

    private isLoggedIn(): Promise<boolean> {
        if (!this.authApi.isLoggedIn()) {
            return Promise.resolve(false);
        }

        return this.authApi
            .validateTicket()
            .then(() => true, () => false)
            .catch(() => false);
    }

    canActivateChild(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Promise<boolean> {
        return this.canActivate(route, state);
    }

    canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Promise<boolean> {

        return this.isLoggedIn().then(isLoggedIn => {
            if (!isLoggedIn) {
                this.authService.setRedirectUrl(state.url);
                this.router.navigate([ '/login' ]);
            }

            return isLoggedIn;
        });
    }
}
