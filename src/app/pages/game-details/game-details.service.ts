import {Injectable, inject, PLATFORM_ID, TransferState, makeStateKey} from '@angular/core';
import { HttpClient } from "@angular/common/http";
import { environment } from "../../../environments/environment";
import { catchError, map, of, throwError, tap } from "rxjs";
import { isPlatformServer } from '@angular/common';

@Injectable({
    providedIn: 'root'
})
export class GameDetailsService {
    private http = inject(HttpClient);
    private state = inject(TransferState);
    private platformId = inject(PLATFORM_ID);

    private GAME_DETAILS_KEY = makeStateKey<any>('gameDetails');

    getGameDetails(id: string) {
        // 1️⃣ თუ SSR-დან ვიღებთ მონაცემებს, მაშინ გამოვიყენოთ TransferState
        if (isPlatformServer(this.platformId)) {
            return this.http.get(`${environment.apiUrl}/game/gameinfo?urlName=${id}`)
                .pipe(
                    tap((res: any) => this.state.set(this.GAME_DETAILS_KEY, res)), // ინახავს მონაცემებს TransferState-ში
                    catchError((error: Error) => throwError(() => error))
                );
        }

        // 2️⃣ Client-Side-ში ჯერ TransferState-ის მონაცემი გამოვიყენოთ (რომ არ გაფლეშოს ჰოუმფეიჯი)
        const storedData = this.state.get(this.GAME_DETAILS_KEY, null);
        this.state.remove(this.GAME_DETAILS_KEY); // წავშალოთ TransferState, რომ ახალი მონაცემი ყოველთვის წამოვიღოთ

        if (storedData) {
            return of(storedData).pipe(
                tap(() => this.fetchLatestGameDetails(id)) // 3️⃣ ახალ მონაცემს წამოვიღებთ API-დან, პარალელურად
            );
        }

        // 4️⃣ თუ TransferState-დან არაფერია, მაშინ პირდაპირ API-ს დავეყრდნოთ
        return this.fetchLatestGameDetails(id);
    }

    private fetchLatestGameDetails(id: string) {
        return this.http.get(`${environment.apiUrl}/game/gameinfo?urlName=${id}`)
            .pipe(
                catchError((error: Error) => throwError(() => error))
            );
    }
}
