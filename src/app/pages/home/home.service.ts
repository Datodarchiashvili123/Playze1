import {Injectable} from '@angular/core';
import {environment} from '../../../environments/environment';
import {catchError, map, throwError} from 'rxjs';
import {HttpClient} from '@angular/common/http';

@Injectable({
    providedIn: 'root',
})
export class HomeService {
    constructor(
        private http: HttpClient,
    ) {
    }

    /**
     * Get deal cards
     * @param id PresetTypeId for deal cards
     */
    getDealCards(id: number) {
        return this.http
            .get(`${environment.apiUrl}/deal/dealcards?PresetTypeId=${id}&take=10`)
            .pipe(
                map((res: any) => res),
                catchError((error: Error) => throwError(() => error))
            );
    }

    /**
     * Get top game cards
     */
    getTopGameCards() {
        return this.http.get(`${environment.apiUrl}/game/gamecards`).pipe(
            map((res: any) => res),
            catchError((error: Error) => throwError(() => error))
        );
    }
}
