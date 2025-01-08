import { Injectable, makeStateKey, TransferState } from '@angular/core';
import { HttpClient } from "@angular/common/http";
import { environment } from "../../../environments/environment";
import { catchError, map, of, throwError } from "rxjs";

// Define keys for caching
const NEWS_DETAILS_KEY = (id: string) => makeStateKey(`newsDetails_${id}`);
const HOT_NEWS_KEY = (id: string) => makeStateKey(`hotNews_${id}`);

@Injectable({
  providedIn: 'root'
})
export class NewsDetailsService {

  constructor(
      private http: HttpClient,
      private transferState: TransferState
  ) {}

  // Cache `getGameDetails` method using TransferState with dynamic keys
  newsDetails(id: string) {
    const cachedData = this.transferState.get(NEWS_DETAILS_KEY(id), null);

    if (cachedData) {
      // Use cached data and remove it from TransferState
      this.transferState.remove(NEWS_DETAILS_KEY(id));
      return of(cachedData);
    } else {
      return this.http.get(`${environment.apiUrl}/announcement/announcementdetails?urlName=${id}`)
          .pipe(
              map((res: any) => {
                // Store the result in TransferState with the dynamic key
                this.transferState.set(NEWS_DETAILS_KEY(id), res);
                return res;
              }),
              catchError((error: Error) => throwError(() => error))
          );
    }
  }

    // Cache `getGameOffers` method using TransferState with dynamic keys
    hotNews(id: string) {
        const cachedData = this.transferState.get(HOT_NEWS_KEY(id), null);

        if (cachedData) {
            // Use cached data and remove it from TransferState
            this.transferState.remove(HOT_NEWS_KEY(id));
            return of(cachedData);
        } else {
            return this.http.get(`${environment.apiUrl}/announcement/hotannouncements`)
                .pipe(
                    map((res: any) => {
                        // Store the result in TransferState with the dynamic key
                        this.transferState.set(HOT_NEWS_KEY(id), res);
                        return res;
                    }),
                    catchError((error: Error) => throwError(() => error))
                );
        }
    }
}
