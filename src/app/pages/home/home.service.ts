import {Injectable, Inject, PLATFORM_ID, makeStateKey, TransferState} from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { environment } from '../../../environments/environment';
import { catchError, map, of, throwError } from 'rxjs';
import { HttpClient } from '@angular/common/http';

@Injectable({
    providedIn: 'root',
})
export class HomeService {
    private cacheTTL = 300000; // Cache expires after 5 minutes (in milliseconds)

    private dealCardCache: { [id: number]: { data: any; timestamp: number } } = {};
    private topGameCardsCache: { data: any; timestamp: number } | null = null;

    // State keys for SSR TransferState
    private DEAL_CARDS_KEY = (id: number) =>
        makeStateKey<any>(`DEAL_CARDS_${id}`);
    private TOP_GAME_CARDS_KEY = makeStateKey<any>('TOP_GAME_CARDS');

    constructor(
        private http: HttpClient,
        private transferState: TransferState,
        @Inject(PLATFORM_ID) private platformId: Object
    ) {}

    /**
     * Get deal cards with caching and TTL
     * @param id PresetTypeId for deal cards
     */
    getDealCards(id: number) {
        const cachedItem = this.dealCardCache[id];
        const isCacheValid =
            cachedItem && Date.now() - cachedItem.timestamp < this.cacheTTL;

        // Use cached data if valid
        if (isCacheValid) {
            return of(cachedItem.data);
        }

        // Check SSR TransferState
        if (this.transferState.hasKey(this.DEAL_CARDS_KEY(id))) {
            const cachedData = this.transferState.get(this.DEAL_CARDS_KEY(id), null);
            this.transferState.remove(this.DEAL_CARDS_KEY(id));
            this.dealCardCache[id] = { data: cachedData, timestamp: Date.now() };
            return of(cachedData);
        }

        // Fetch data from API and cache it
        return this.http
            .get(`${environment.apiUrl}/deal/dealcards?PresetTypeId=${id}&take=10`)
            .pipe(
                map((res: any) => {
                    this.dealCardCache[id] = { data: res, timestamp: Date.now() };
                    if (!isPlatformBrowser(this.platformId)) {
                        this.transferState.set(this.DEAL_CARDS_KEY(id), res);
                    }
                    return res;
                }),
                catchError((error: Error) => throwError(() => error))
            );
    }

    /**
     * Get top game cards with caching and TTL
     */
    getTopGameCards() {
        const cachedItem = this.topGameCardsCache;
        const isCacheValid =
            cachedItem && Date.now() - cachedItem.timestamp < this.cacheTTL;

        // Use cached data if valid
        if (isCacheValid) {
            return of(cachedItem.data);
        }

        // Check SSR TransferState
        if (this.transferState.hasKey(this.TOP_GAME_CARDS_KEY)) {
            const cachedData = this.transferState.get(this.TOP_GAME_CARDS_KEY, null);
            this.transferState.remove(this.TOP_GAME_CARDS_KEY);
            this.topGameCardsCache = { data: cachedData, timestamp: Date.now() };
            return of(cachedData);
        }

        // Fetch data from API and cache it
        return this.http.get(`${environment.apiUrl}/game/gamecards`).pipe(
            map((res: any) => {
                this.topGameCardsCache = { data: res, timestamp: Date.now() };
                if (!isPlatformBrowser(this.platformId)) {
                    this.transferState.set(this.TOP_GAME_CARDS_KEY, res);
                }
                return res;
            }),
            catchError((error: Error) => throwError(() => error))
        );
    }

    /**
     * Clear the in-memory cache manually
     */
    clearCache() {
        this.dealCardCache = {};
        this.topGameCardsCache = null;
    }

    /**
     * Clear cache for specific deal cards
     * @param id PresetTypeId for deal cards
     */
    clearDealCardCache(id: number) {
        delete this.dealCardCache[id];
    }
}
