import {ApplicationConfig} from '@angular/core';
import {PreloadAllModules, provideRouter, withPreloading} from '@angular/router';

import {routes} from './app.routes';
import {provideClientHydration, withHttpTransferCacheOptions} from '@angular/platform-browser';
import {provideHttpClient, withFetch} from "@angular/common/http";
import {provideAnimations} from "@angular/platform-browser/animations";

export const appConfig: ApplicationConfig = {
    providers: [
        provideAnimations(),  // Use provideAnimations instead of BrowserAnimationsModule
        provideRouter(routes, {initialNavigation: 'enabledBlocking'}, withPreloading(PreloadAllModules)),
        provideHttpClient(withFetch()),
        provideClientHydration(
            withHttpTransferCacheOptions({
                includePostRequests: false,
                includeRequestsWithAuthHeaders: false,
            })
        ),
    ]
};
