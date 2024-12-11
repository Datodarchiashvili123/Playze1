import { Injectable, makeStateKey, TransferState } from '@angular/core';
import { HttpClient } from "@angular/common/http";
import { environment } from "../../../environments/environment";
import { catchError, map, of, throwError } from "rxjs";

// Define keys for caching
const GAME_DETAILS_KEY = (id: string) => makeStateKey(`gameDetails_${id}`);
const GAME_GALLERY_KEY = (id: string) => makeStateKey(`gameGallery_${id}`);
const GAME_OFFERS_KEY = (id: string) => makeStateKey(`gameOffers_${id}`);

@Injectable({
    providedIn: 'root'
})
export class GameDetailsService {

    constructor(
        private http: HttpClient,
        private transferState: TransferState
    ) {}

    // Cache `getGameDetails` method using TransferState with dynamic keys
    getGameDetails(id: string) {
        const cachedData = this.transferState.get(GAME_DETAILS_KEY(id), null);

        if (cachedData) {
            // Use cached data and remove it from TransferState
            this.transferState.remove(GAME_DETAILS_KEY(id));
            return of(cachedData);
        } else {
            return this.http.get(`${environment.apiUrl}/game/gameinfo?urlName=${id}`)
                .pipe(
                    map((res: any) => {
                        // Store the result in TransferState with the dynamic key
                        this.transferState.set(GAME_DETAILS_KEY(id), res);
                        return res;
                    }),
                    catchError((error: Error) => throwError(() => error))
                );
        }
    }

    // Cache `getGameGallery` method using TransferState with dynamic keys
    getGameGallery(id: string) {
        const cachedData = this.transferState.get(GAME_GALLERY_KEY(id), null);

        if (cachedData) {
            // Use cached data and remove it from TransferState
            this.transferState.remove(GAME_GALLERY_KEY(id));
            return of(cachedData);
        } else {
            return this.http.get(`${environment.apiUrl}/game/gamegallery?UrlName=${id}`)
                .pipe(
                    map((res: any) => {
                        // Store the result in TransferState with the dynamic key
                        this.transferState.set(GAME_GALLERY_KEY(id), res);
                        return res;
                    }),
                    catchError((error: Error) => throwError(() => error))
                );
        }
    }

    // Cache `getGameOffers` method using TransferState with dynamic keys
    getGameOffers(id: string) {
        const cachedData = this.transferState.get(GAME_OFFERS_KEY(id), null);

        if (cachedData) {
            // Use cached data and remove it from TransferState
            this.transferState.remove(GAME_OFFERS_KEY(id));
            return of(cachedData);
        } else {
            return this.http.get(`${environment.apiUrl}/game/gameoffers?UrlName=${id}`)
                .pipe(
                    map((res: any) => {
                        // Store the result in TransferState with the dynamic key
                        this.transferState.set(GAME_OFFERS_KEY(id), res);
                        return res;
                    }),
                    catchError((error: Error) => throwError(() => error))
                );
        }
    }
}
