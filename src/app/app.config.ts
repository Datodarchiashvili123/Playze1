import { ApplicationConfig } from '@angular/core';
import { PreloadAllModules, provideRouter, withPreloading, withComponentInputBinding, withInMemoryScrolling } from '@angular/router';

import { routes } from './app.routes';
import { provideClientHydration, withHttpTransferCacheOptions } from '@angular/platform-browser';
import { provideHttpClient, withFetch } from "@angular/common/http";
import { provideAnimations } from "@angular/platform-browser/animations";

export const appConfig: ApplicationConfig = {
    providers: [
        provideAnimations(),  // Angular 19-ისთვის სწორი ანიმაციების მხარდაჭერა
        provideRouter(routes,
            withPreloading(PreloadAllModules),
            withComponentInputBinding(),
            withInMemoryScrolling({ scrollPositionRestoration: 'enabled' }) // მომხმარებლის ფანჯრის პოზიციის აღდგენა
        ),
        provideHttpClient(withFetch()),
        provideClientHydration( // `defer: true` აღარ არის საჭირო
            withHttpTransferCacheOptions({
                includePostRequests: false,
            })
        ),
    ]
};
