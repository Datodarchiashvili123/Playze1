import { Injectable, Inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { environment } from '../../../environments/environment';
import { catchError, map, of, throwError } from 'rxjs';
import { HttpClient } from '@angular/common/http';

// Cache duration: 24 hours in milliseconds
const CACHE_DURATION_MS = 24 * 60 * 60 * 1000; // 24 hours

@Injectable({
    providedIn: 'root'
})
export class HomeService {

    constructor(
        private http: HttpClient,
        @Inject(PLATFORM_ID) private platformId: Object // Injecting PLATFORM_ID to check browser
    ) {}

    // Helper function to check if running in the browser
    private isBrowser(): boolean {
        return isPlatformBrowser(this.platformId);
    }

    // Helper function to check if cached data is expired
    private isCacheExpired(timestamp: number): boolean {
        const now = Date.now();
        return now - timestamp > CACHE_DURATION_MS;
    }

    // Helper function to get cached data from localStorage (or sessionStorage)
    private getCachedData(key: string) {
        if (!this.isBrowser()) return null; // Only proceed if we're in the browser

        const cachedItem = localStorage.getItem(key); // Use sessionStorage if desired
        if (cachedItem) {
            const parsedItem = JSON.parse(cachedItem);
            if (!this.isCacheExpired(parsedItem.timestamp)) {
                return parsedItem.data;
            }
            localStorage.removeItem(key);  // Remove expired cache
        }
        return null;
    }

    // Helper function to cache data in localStorage (or sessionStorage)
    private setCachedData(key: string, data: any) {
        if (!this.isBrowser()) return; // Only proceed if we're in the browser

        const cacheItem = {
            timestamp: Date.now(),
            data: data
        };
        localStorage.setItem(key, JSON.stringify(cacheItem)); // Use sessionStorage if needed
    }

    // Generate dynamic key for deal cards
    private getDealCardsKey(id: number): string {
        return `dealCards_${id}`;
    }

    // Cache `getDealCards` method using localStorage with dynamic keys
    getDealCards(id: number) {
        const cacheKey = this.getDealCardsKey(id);
        const cachedData = this.getCachedData(cacheKey);

        if (cachedData) {
            return of(cachedData);
        } else {
            return this.http.get(`${environment.apiUrl}/deal/dealcards?PresetTypeId=${id}&take=10`)
                .pipe(
                    map((res: any) => {
                        // Cache the result in localStorage with the dynamic key
                        this.setCachedData(cacheKey, res);
                        return res;
                    }),
                    catchError((error: Error) => throwError(() => error))
                );
        }
    }

    // Static key for top game cards
    private TOP_GAME_CARDS_KEY = 'topGameCards';

    // Cache `getTopGameCards` method using localStorage with a static key
    getTopGameCards() {
        const cachedData = this.getCachedData(this.TOP_GAME_CARDS_KEY);
        if (cachedData) {
            return of(cachedData);
        } else {
            return this.http.get(`${environment.apiUrl}/game/gamecards`)
                .pipe(
                    map((res: any) => {
                        // Cache the result in localStorage with a static key
                        this.setCachedData(this.TOP_GAME_CARDS_KEY, res);
                        return res;
                    }),
                    catchError((error: Error) => throwError(() => error))
                );
        }
    }
}
