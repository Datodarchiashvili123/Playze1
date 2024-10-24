import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { catchError, map, of, throwError } from 'rxjs';
import { environment } from "../../../environments/environment";

// Cache duration: 24 hours in milliseconds
const CACHE_DURATION_MS = 24 * 60 * 60 * 1000; // 24 hours

@Injectable({
    providedIn: 'root'
})
export class HomeService {

    constructor(private http: HttpClient) {}

    // Check if cached data is still valid
    private isCacheExpired(timestamp: number): boolean {
        const now = Date.now();
        return now - timestamp > CACHE_DURATION_MS;
    }

    // Helper function to retrieve cache from localStorage (or sessionStorage)
    private getCachedData(key: string) {
        const cachedItem = localStorage.getItem(key); // Change to sessionStorage if needed
        if (cachedItem) {
            const parsedItem = JSON.parse(cachedItem);
            if (!this.isCacheExpired(parsedItem.timestamp)) {
                return parsedItem.data;  // Return valid cached data
            }
            localStorage.removeItem(key);  // Remove expired cache
        }
        return null;
    }

    // Helper function to set cache in localStorage (or sessionStorage)
    private setCachedData(key: string, data: any) {
        const cacheItem = {
            timestamp: Date.now(),
            data: data
        };
        localStorage.setItem(key, JSON.stringify(cacheItem)); // Change to sessionStorage if needed
    }

    // Fetch deal cards and cache in localStorage
    getDealCards(id: number) {
        const cacheKey = `dealCards_${id}`;
        const cachedData = this.getCachedData(cacheKey);

        if (cachedData) {
            // Return cached data if valid
            return of(cachedData);
        } else {
            // Make API call if no valid cache is available
            return this.http.get(`${environment.apiUrl}/deal/dealcards?PresetTypeId=${id}&take=10`)
                .pipe(
                    map((res: any) => {
                        // Cache the response in localStorage
                        this.setCachedData(cacheKey, res);
                        return res;
                    }),
                    catchError((error: Error) => throwError(() => error))
                );
        }
    }

    // Fetch top game cards and cache in localStorage
    getTopGameCards() {
        const cacheKey = 'topGameCards';
        const cachedData = this.getCachedData(cacheKey);

        if (cachedData) {
            // Return cached data if valid
            return of(cachedData);
        } else {
            // Make API call if no valid cache is available
            return this.http.get(`${environment.apiUrl}/game/gamecards`)
                .pipe(
                    map((res: any) => {
                        // Cache the response in localStorage
                        this.setCachedData(cacheKey, res);
                        return res;
                    }),
                    catchError((error: Error) => throwError(() => error))
                );
        }
    }
}
