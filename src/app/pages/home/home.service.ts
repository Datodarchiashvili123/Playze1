import { Injectable, makeStateKey, TransferState } from '@angular/core';
import { environment } from "../../../environments/environment";
import { catchError, map, of, throwError } from "rxjs";
import { HttpClient } from "@angular/common/http";
import { isPlatformServer } from '@angular/common';
import { Inject, PLATFORM_ID } from '@angular/core';

// Define keys for caching
const DEAL_CARDS_KEY = (id: number) => makeStateKey(`dealCards_${id}`);
const TOP_GAME_CARDS_KEY = makeStateKey('topGameCards');

// Cache duration: 24 hours in milliseconds
const CACHE_DURATION_MS = 24 * 60 * 60 * 1000; // 24 hours

@Injectable({
    providedIn: 'root'
})
export class HomeService {

    private cacheTimestamps: { [key: string]: number } = {};  // Store cache timestamps

    constructor(
        private http: HttpClient,
        private transferState: TransferState,
        @Inject(PLATFORM_ID) private platformId: object // Injecting platform ID to check if we're on the server
    ) {}

    // Helper function to check if cached data is still valid
    private isCacheExpired(key: string): boolean {
        const now = Date.now();
        const lastUpdated = this.cacheTimestamps[key] || 0;
        return now - lastUpdated > CACHE_DURATION_MS;
    }

    // Cache `getDealCards` method using TransferState with dynamic keys and 24-hour cache
    getDealCards(id: number) {
        const cacheKey = `dealCards_${id}`;
        const cachedData = this.transferState.get(DEAL_CARDS_KEY(id), null);

        if (cachedData && !this.isCacheExpired(cacheKey)) {
            // Use cached data and remove it from TransferState if on client
            if (!isPlatformServer(this.platformId)) {
                this.transferState.remove(DEAL_CARDS_KEY(id));
            }
            return of(cachedData);
        } else {
            return this.http.get(`${environment.apiUrl}/deal/dealcards?PresetTypeId=${id}&take=10`)
                .pipe(
                    map((res: any) => {
                        // Update the cache and the timestamp if on server
                        if (isPlatformServer(this.platformId)) {
                            this.transferState.set(DEAL_CARDS_KEY(id), res);
                            this.cacheTimestamps[cacheKey] = Date.now(); // Set cache timestamp
                        }
                        return res;
                    }),
                    catchError((error: Error) => throwError(() => error))
                );
        }
    }

    // Cache `getTopGameCards` method using TransferState with a static key and 24-hour cache
    getTopGameCards() {
        const cacheKey = 'topGameCards';
        const cachedData = this.transferState.get(TOP_GAME_CARDS_KEY, null);

        if (cachedData && !this.isCacheExpired(cacheKey)) {
            // Use cached data and remove it from TransferState if on client
            if (!isPlatformServer(this.platformId)) {
                this.transferState.remove(TOP_GAME_CARDS_KEY);
            }
            return of(cachedData);
        } else {
            return this.http.get(`${environment.apiUrl}/game/gamecards`)
                .pipe(
                    map((res: any) => {
                        // Update the cache and the timestamp if on server
                        if (isPlatformServer(this.platformId)) {
                            this.transferState.set(TOP_GAME_CARDS_KEY, res);
                            this.cacheTimestamps[cacheKey] = Date.now(); // Set cache timestamp
                        }
                        return res;
                    }),
                    catchError((error: Error) => throwError(() => error))
                );
        }
    }
}
