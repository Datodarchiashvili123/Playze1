import { Injectable, makeStateKey, TransferState } from '@angular/core';
import { catchError, map, of, Subject, throwError } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { takeUntil } from 'rxjs/operators';

@Injectable({
    providedIn: 'root',
})
export class GamesService {
    private cancelRequest$ = new Subject<void>(); // Subject to cancel the request

    constructor(private http: HttpClient, private transferState: TransferState) {}

    private getGamesKey(pageNumber?: number, pageSize?: number, filters?: any, orderBy = 'Popularity', name?: string) {
        const filterString = filters ? JSON.stringify(filters) : '';
        return makeStateKey(`games_${pageNumber || 1}_${pageSize || 10}_${filterString}_${orderBy}_${name || ''}`);
    }

    // Cancel the ongoing request by emitting from cancelRequest$
    cancelRequest() {
        this.cancelRequest$.next();
    }

    getGames(pageNumber?: number, pageSize?: number, filters?: any, orderBy = 'Popularity', name?: string) {
        const gamesKey = this.getGamesKey(pageNumber, pageSize, filters, orderBy, name);
        const cachedData = this.transferState.get(gamesKey, null);

        if (cachedData) {
            this.transferState.remove(gamesKey);
            return of(cachedData);
        } else {
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
                map((res: any) => {
                    this.transferState.set(gamesKey, res);
                    return res;
                }),
                catchError((error: Error) => {
                    return throwError(() => error);
                })
            );
        }
    }
}
