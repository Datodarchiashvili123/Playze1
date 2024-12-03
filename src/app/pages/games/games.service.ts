import { Injectable, Inject, PLATFORM_ID } from '@angular/core';
import { environment } from '../../../environments/environment';
import { catchError, map, throwError } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';

@Injectable({
    providedIn: 'root',
})
export class GamesService {
    private cancelRequest$ = new Subject<void>(); // Subject to cancel the request

    constructor(
        private http: HttpClient,
        @Inject(PLATFORM_ID) private platformId: Object // Inject PLATFORM_ID to detect if in the browser
    ) {}

    // Cancel the ongoing request by emitting from cancelRequest$
    cancelRequest() {
        this.cancelRequest$.next();
    }

    getGames(pageNumber?: number, pageSize?: number, filters?: any, orderBy = 'Popularity', name?: string) {
        let apiUrl = `${environment.apiUrl}/game/games?`;

        if (name) {
            apiUrl += `Name=${name}`;
        }
        if (pageSize) {
            apiUrl += `&PageSize=${pageSize}`;
        }
        if (pageNumber) {
            apiUrl += `&PageNumber=${pageNumber}`;
        }
        if (filters) {
            Object.keys(filters).forEach((key) => {
                const filterValue = filters[key];
                if (Array.isArray(filterValue)) {
                    filterValue.forEach((value: any) => {
                        if (value) {
                            apiUrl += `&${key}=${value}`;
                        }
                    });
                } else if (filterValue) {
                    apiUrl += `&${key}=${filterValue}`;
                }
            });
        }
        if (orderBy) {
            apiUrl += `&OrderBy=${orderBy}`;
        }

        // Make the HTTP request and use takeUntil to cancel if needed
        return this.http.get(apiUrl).pipe(
            takeUntil(this.cancelRequest$), // Cancel the request when cancelRequest$ emits
            map((res: any) => res),
            catchError((error: Error) => throwError(() => error))
        );
    }
}
