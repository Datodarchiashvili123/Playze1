import { Injectable, Inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { catchError, map, of, Subject, throwError } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { takeUntil } from 'rxjs/operators';

// Cache duration: 24 hours in milliseconds
const CACHE_DURATION_MS = 24 * 60 * 60 * 1000; // 24 hours

@Injectable({
    providedIn: 'root',
})
export class GamesService {
    private cancelRequest$ = new Subject<void>(); // Subject to cancel the request

    constructor(
        private http: HttpClient,
        @Inject(PLATFORM_ID) private platformId: Object // Inject PLATFORM_ID to detect if in the browser
    ) {}

    // Helper function to check if running in the browser
    private isBrowser(): boolean {
        return isPlatformBrowser(this.platformId);
    }

    // Helper function to check if localStorage is available
    private isLocalStorageAvailable(): boolean {
        try {
            const testKey = '__test__';
            localStorage.setItem(testKey, 'test');
            localStorage.removeItem(testKey);
            return true;
        } catch (e) {
            return false;
        }
    }

    // Helper function to check if cached data is expired
    private isCacheExpired(timestamp: number): boolean {
        const now = Date.now();
        return now - timestamp > CACHE_DURATION_MS;
    }

    // Helper function to get cached data from localStorage (or sessionStorage)
    private getCachedData(key: string) {
        if (!this.isBrowser() || !this.isLocalStorageAvailable()) return null; // Only proceed if we're in the browser and localStorage is available

        const cachedItem = localStorage.getItem(key); // Use sessionStorage if you prefer
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
        if (!this.isBrowser() || !this.isLocalStorageAvailable()) return; // Only proceed if we're in the browser and localStorage is available

        const cacheItem = {
            timestamp: Date.now(),
            data: data
        };
        localStorage.setItem(key, JSON.stringify(cacheItem)); // Use sessionStorage if needed
    }

    private getGamesKey(pageNumber?: number, pageSize?: number, filters?: any, orderBy = 'Popularity', name?: string) {
        const filterString = filters ? JSON.stringify(filters) : '';
        return `games_${pageNumber || 1}_${pageSize || 10}_${filterString}_${orderBy}_${name || ''}`;
    }

    // Cancel the ongoing request by emitting from cancelRequest$
    cancelRequest() {
        this.cancelRequest$.next();
    }

    getGames(pageNumber?: number, pageSize?: number, filters?: any, orderBy = 'Popularity', name?: string) {
        const gamesKey = this.getGamesKey(pageNumber, pageSize, filters, orderBy, name);
        const cachedData = this.getCachedData(gamesKey);

        if (cachedData) {
            return of(cachedData);
        } else {
            let apiUrl = `${environment.apiUrl}/game/games?`;

            if (name) {
                apiUrl += `Name=${name}`;
            }
            if (pageSize) {
                apiUrl += `&PageSize=${pageSize}`;
            }
            if (pageNumber) {
                apiUrl += `&PageNumber=${pageNumber}`;
            }
            if (filters) {
                Object.keys(filters).forEach((key) => {
                    const filterValue = filters[key];
                    if (Array.isArray(filterValue)) {
                        filterValue.forEach((value: any) => {
                            if (value) {
                                apiUrl += `&${key}=${value}`;
                            }
                        });
                    } else if (filterValue) {
                        apiUrl += `&${key}=${filterValue}`;
                    }
                });
            }
            if (orderBy) {
                apiUrl += `&OrderBy=${orderBy}`;
            }

            // Make the HTTP request and use takeUntil to cancel if needed
            return this.http.get(apiUrl).pipe(
                takeUntil(this.cancelRequest$), // Cancel the request when cancelRequest$ emits
                map((res: any) => {
                    this.setCachedData(gamesKey, res);
                    return res;
                }),
                catchError((error: Error) => throwError(() => error))
            );
        }
    }
}
