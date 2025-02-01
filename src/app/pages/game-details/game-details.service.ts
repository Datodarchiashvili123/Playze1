import { Injectable } from '@angular/core';
import { HttpClient } from "@angular/common/http";
import { environment } from "../../../environments/environment";
import { catchError, map, throwError } from "rxjs";

@Injectable({
    providedIn: 'root'
})
export class GameDetailsService {

    constructor(
        private http: HttpClient
    ) {}

    getGameDetails(id: string) {
        return this.http.get(`${environment.apiUrl}/game/gameinfo?urlName=${id}`)
            .pipe(
                map((res: any) => res),
                catchError((error: Error) => throwError(() => error))
            );
    }

    getGameGallery(id: string) {
        return this.http.get(`${environment.apiUrl}/game/gamegallery?UrlName=${id}`)
            .pipe(
                map((res: any) => res),
                catchError((error: Error) => throwError(() => error))
            );
    }

    getGameOffers(id: string) {
        return this.http.get(`${environment.apiUrl}/game/gameoffers?UrlName=${id}`)
            .pipe(
                map((res: any) => res),
                catchError((error: Error) => throwError(() => error))
            );
    }
}
