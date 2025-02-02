import { Injectable, makeStateKey, TransferState } from '@angular/core';
import { HttpClient } from "@angular/common/http";
import { environment } from "../../environments/environment";
import { of, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';

@Injectable({
    providedIn: 'root'
})
export class FiltersService {

    constructor(private http: HttpClient, private transferState: TransferState) {}

    // Cache `getGenres` method
    getGenres() {
        const GENRES_KEY = makeStateKey('genres');
        const cachedData = this.transferState.get(GENRES_KEY, null);

        if (cachedData) {
            // Return cached data if available
            this.transferState.remove(GENRES_KEY);
            return of(cachedData);
        } else {
            return this.http.get(`${environment.apiUrl}/genre/genres`)
                .pipe(
                    map((res: any) => {
                        // Cache the result
                        this.transferState.set(GENRES_KEY, res);
                        return res;
                    }),
                    catchError((error: Error) => throwError(() => error))
                );
        }
    }

    // Cache `getDevelopers` method
    getDevelopers() {
        const DEVELOPERS_KEY = makeStateKey('developers');
        const cachedData = this.transferState.get(DEVELOPERS_KEY, null);

        if (cachedData) {
            // Return cached data if available
            this.transferState.remove(DEVELOPERS_KEY);
            return of(cachedData);
        } else {
            return this.http.get(`${environment.apiUrl}/developer/developers`)
                .pipe(
                    map((res: any) => {
                        // Cache the result
                        this.transferState.set(DEVELOPERS_KEY, res);
                        return res;
                    }),
                    catchError((error: Error) => throwError(() => error))
                );
        }
    }

    // Cache `getPublishers` method
    getPublishers() {
        const PUBLISHERS_KEY = makeStateKey('publishers');
        const cachedData = this.transferState.get(PUBLISHERS_KEY, null);

        if (cachedData) {
            // Return cached data if available
            this.transferState.remove(PUBLISHERS_KEY);
            return of(cachedData);
        } else {
            return this.http.get(`${environment.apiUrl}/publisher/publishers`)
                .pipe(
                    map((res: any) => {
                        // Cache the result
                        this.transferState.set(PUBLISHERS_KEY, res);
                        return res;
                    }),
                    catchError((error: Error) => throwError(() => error))
                );
        }
    }

    // Cache `getPlatforms` method
    getPlatforms() {
        const PLATFORMS_KEY = makeStateKey('platforms');
        const cachedData = this.transferState.get(PLATFORMS_KEY, null);

        if (cachedData) {
            // Return cached data if available
            this.transferState.remove(PLATFORMS_KEY);
            return of(cachedData);
        } else {
            return this.http.get(`${environment.apiUrl}/platform/platforms`)
                .pipe(
                    map((res: any) => {
                        // Cache the result
                        this.transferState.set(PLATFORMS_KEY, res);
                        return res;
                    }),
                    catchError((error: Error) => throwError(() => error))
                );
        }
    }
}

