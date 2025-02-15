import { mergeApplicationConfig, ApplicationConfig } from '@angular/core';
import { provideServerRendering } from '@angular/platform-server';
import { appConfig } from './app.config';
import {provideRouter} from "@angular/router";
import {routes} from "./app.routes";
import {provideHttpClient, withFetch} from "@angular/common/http";
import {provideClientHydration, withHttpTransferCacheOptions} from "@angular/platform-browser";

const serverConfig: ApplicationConfig = {
  providers: [
    provideServerRendering(),
    provideRouter(routes),
    provideHttpClient(withFetch()),
    provideClientHydration(
        withHttpTransferCacheOptions({
          includePostRequests: false,
          includeRequestsWithAuthHeaders: false,
        }),
    ),

  ]
};

export const config = mergeApplicationConfig(appConfig, serverConfig);
