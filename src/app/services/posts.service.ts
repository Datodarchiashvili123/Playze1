import {Injectable, Inject, PLATFORM_ID, makeStateKey, TransferState} from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { catchError, map, throwError, of, Subject } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { takeUntil } from 'rxjs/operators';
import {environment} from "../../environments/environment";


@Injectable({
  providedIn: 'root',
})

export class PostsService {
  private cacheTTL = 300000; // Cache expiration time in milliseconds (5 minutes)
  private gamesCache: { [key: string]: { data: any; timestamp: number } } = {}; // In-memory cache
  private cancelRequest$ = new Subject<void>(); // Subject for request cancellation

  // TransferState keys for SSR
  private GAMES_KEY = (key: string) => makeStateKey<any>(`GAMES_${key}`);

  constructor(
      private http: HttpClient,
      private transferState: TransferState,
      @Inject(PLATFORM_ID) private platformId: Object
  ) {}

  /**
   * Get games with TransferState, in-memory caching, and cancelable requests
   * @param pageNumber Page number for pagination
   * @param pageSize Number of items per page
   * @param filters Object containing filter criteria
   * @param orderBy Order by criteria, default is 'Popularity'
   * @param name Game name to search
   * @returns Observable with the response
   */
  getGames(pageNumber?: number, pageSize?: number, filters?: any, orderBy = 'Popularity', name?: string) {
    // Construct a cache key based on parameters
    const cacheKey = this.buildCacheKey(pageNumber, pageSize, filters, orderBy, name);
    const transferStateKey = this.GAMES_KEY(cacheKey);

    // Check in-memory cache
    const cachedItem = this.gamesCache[cacheKey];
    const isCacheValid =
        cachedItem && Date.now() - cachedItem.timestamp < this.cacheTTL;

    if (isCacheValid) {
      return of(cachedItem.data);
    }

    // Check TransferState for SSR
    if (this.transferState.hasKey(transferStateKey)) {
      const cachedData = this.transferState.get(transferStateKey, null);
      this.transferState.remove(transferStateKey); // Clean up TransferState
      this.gamesCache[cacheKey] = { data: cachedData, timestamp: Date.now() };
      return of(cachedData);
    }

    // Build API URL dynamically
    let apiUrl = `${environment.apiUrl}/game/games?`;
    if (name) apiUrl += `Name=${name}`;
    if (pageSize) apiUrl += `&PageSize=${pageSize}`;
    if (pageNumber) apiUrl += `&PageNumber=${pageNumber}`;
    if (filters) {
      Object.keys(filters).forEach((key) => {
        const value = filters[key];
        if (Array.isArray(value)) {
          value.forEach((val: any) => {
            apiUrl += `&${key}=${val}`;
          });
        } else if (value !== undefined && value !== null) {
          apiUrl += `&${key}=${value}`;
        }
      });
    }
    if (orderBy) apiUrl += `&OrderBy=${orderBy}`;

    // Fetch data from API and cache it
    return this.http.get(apiUrl).pipe(
        takeUntil(this.cancelRequest$), // Cancel the request when cancelRequest$ emits
        map((res: any) => {
          this.gamesCache[cacheKey] = { data: res, timestamp: Date.now() }; // Save to cache
          if (!isPlatformBrowser(this.platformId)) {
            this.transferState.set(transferStateKey, res); // Save to TransferState for SSR
          }
          return res;
        }),
        catchError((error: Error) => throwError(() => error))
    );
  }

  /**
   * Cancel the ongoing HTTP request
   */
  cancelRequest() {
    this.cancelRequest$.next();
    this.cancelRequest$.complete(); // Prevent memory leaks
    this.cancelRequest$ = new Subject<void>(); // Reinitialize for future requests
  }

  /**
   * Build a unique cache key based on parameters
   */
  private buildCacheKey(pageNumber?: number, pageSize?: number, filters?: any, orderBy = 'Popularity', name?: string): string {
    return JSON.stringify({ pageNumber, pageSize, filters, orderBy, name });
  }

  /**
   * Clear the entire in-memory cache
   */
  clearCache() {
    this.gamesCache = {};
  }

  /**
   * Clear specific cache by key
   * @param cacheKey Key of the cache to clear
   */
  clearCacheByKey(cacheKey: string) {
    delete this.gamesCache[cacheKey];
  }
}
