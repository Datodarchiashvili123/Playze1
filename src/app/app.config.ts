import {ApplicationConfig} from '@angular/core';
import {NoPreloading, PreloadAllModules, provideRouter, withPreloading} from '@angular/router';

import {routes} from './app.routes';
import {provideClientHydration, withHttpTransferCacheOptions} from '@angular/platform-browser';
import { provideHttpClient, withFetch } from "@angular/common/http";
import {BrowserAnimationsModule, provideAnimations} from "@angular/platform-browser/animations";

export const appConfig: ApplicationConfig = {
    providers: [
        provideAnimations(),  // Use provideAnimations instead of BrowserAnimationsModule
        provideRouter(routes, withPreloading(NoPreloading)),
        provideHttpClient(withFetch()),
        provideClientHydration(
            withHttpTransferCacheOptions({
                includePostRequests: false,
                includeRequestsWithAuthHeaders: false,
            })
        ),
    ]
};
