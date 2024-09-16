import { Injectable, makeStateKey, TransferState } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { catchError, map, of, throwError } from 'rxjs';
import { environment } from '../../../environments/environment';

// Define a key for caching each game detail card by `gameId`
const GAME_DETAIL_CARD_KEY = (id: string) => makeStateKey(`gameDetailCard_${id}`);

// Set cache time-to-live (TTL) to 5 minutes (300,000 ms)
const CACHE_TTL = 300000;

@Injectable({
    providedIn: 'root'
})
export class GameDetailCardService {
    private gameDetailCache: { [key: string]: { data: any, timestamp: number } } = {};
    private readonly CACHE_TTL = 300000; // 5 minutes in milliseconds

    constructor(private http: HttpClient, private transferState: TransferState) {
    }

    getGameDetailCard(gameId: string) {
        // Check cache for the given gameId
        if (this.gameDetailCache[gameId]) {
            const cachedItem = this.gameDetailCache[gameId];
            const isCacheValid = (Date.now() - cachedItem.timestamp) < this.CACHE_TTL;

            // Return the cached data if it's still valid
            if (isCacheValid) {
                return of(cachedItem.data);
            } else {
                // Cache expired, remove the cache entry
                delete this.gameDetailCache[gameId];
            }
        }

        // Fetch new data from the server
        return this.http.get(`${environment.apiUrl}/game/detailcard?Id=${gameId}`).pipe(
            map((res: any) => {
                // Cache the new result with timestamp
                this.gameDetailCache[gameId] = { data: res, timestamp: Date.now() };
                return res;
            }),
            catchError((error: Error) => throwError(() => error))
        );
    }
}

