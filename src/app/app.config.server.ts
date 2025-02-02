import {ApplicationConfig, mergeApplicationConfig} from '@angular/core';
import {provideServerRendering} from '@angular/platform-server';
import {appConfig} from './app.config';
import {APP_BASE_HREF} from "@angular/common";
import * as url from "node:url";
import {routes} from "./app.routes";
import {provideRouter} from "@angular/router";

const serverConfig: ApplicationConfig = {
    providers: [
        provideServerRendering(),
        provideRouter(routes)
    ]
};

export const config = mergeApplicationConfig(appConfig, serverConfig);
