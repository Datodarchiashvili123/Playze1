import { Injectable, Inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { environment } from '../../../environments/environment';
import { catchError, map, throwError } from 'rxjs';
import { HttpClient } from '@angular/common/http';

@Injectable({
    providedIn: 'root'
})
export class HomeService {

    constructor(
        private http: HttpClient,
        @Inject(PLATFORM_ID) private platformId: Object // Injecting PLATFORM_ID to check browser
    ) {}

    // Fetch deal cards without caching
    getDealCards(id: number) {
        return this.http.get(`${environment.apiUrl}/deal/dealcards?PresetTypeId=${id}&take=10`)
            .pipe(
                map((res: any) => res),
                catchError((error: Error) => throwError(() => error))
            );
    }

    // Fetch top game cards without caching
    getTopGameCards() {
        return this.http.get(`${environment.apiUrl}/game/gamecards`)
            .pipe(
                map((res: any) => res),
                catchError((error: Error) => throwError(() => error))
            );
    }
}
