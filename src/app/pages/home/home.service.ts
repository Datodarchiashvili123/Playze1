import { Injectable, makeStateKey, TransferState } from '@angular/core';
import { environment } from "../../../environments/environment";
import { catchError, map, of, throwError } from "rxjs";
import { HttpClient } from "@angular/common/http";

// Define keys for caching
const DEAL_CARDS_KEY = (id: number) => makeStateKey(`dealCards_${id}`);  // Dynamic key for deal cards
const TOP_GAME_CARDS_KEY = makeStateKey('topGameCards');                 // Static key for top game cards

@Injectable({
    providedIn: 'root'
})
export class HomeService {

    constructor(
        private http: HttpClient,
        private transferState: TransferState
    ) {}

    // Cache `getDealCards` method using TransferState with dynamic keys
    getDealCards(id: number) {
        const cachedData = this.transferState.get(DEAL_CARDS_KEY(id), null);

        if (cachedData) {
            // Use cached data and remove it from TransferState
            this.transferState.remove(DEAL_CARDS_KEY(id));
            return of(cachedData);
        } else {
            return this.http.get(`${environment.apiUrl}/deal/dealcards?PresetTypeId=${id}&take=10`)
                .pipe(
                    map((res: any) => {
                        // Store the result in TransferState with the dynamic key
                        this.transferState.set(DEAL_CARDS_KEY(id), res);
                        return res;
                    }),
                    catchError((error: Error) => throwError(() => error))
                );
        }
    }

    // Cache `getTopGameCards` method using TransferState with a static key
    getTopGameCards() {
        const cachedData = this.transferState.get(TOP_GAME_CARDS_KEY, null);
        if (cachedData) {
            // Use cached data and remove from TransferState
            this.transferState.remove(TOP_GAME_CARDS_KEY);
            return of(cachedData);
        } else {
            return this.http.get(`${environment.apiUrl}/game/gamecards`)
                .pipe(
                    map((res: any) => {
                        // Store the result in TransferState
                        this.transferState.set(TOP_GAME_CARDS_KEY, res);
                        return res;
                    }),
                    catchError((error: Error) => throwError(() => error))
                );
        }
    }
}
