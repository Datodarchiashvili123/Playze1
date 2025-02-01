import { Injectable, Inject, PLATFORM_ID } from '@angular/core';
import { catchError, map, throwError } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import {environment} from "../../environments/environment";

@Injectable({
  providedIn: 'root',
})
export class PostsService {
  constructor(
      private http: HttpClient,
      @Inject(PLATFORM_ID) private platformId: Object
  ) {
    console.log('post service works')
  }

  /**
   * Get games
   * @param pageNumber Page number for pagination
   * @param pageSize Number of items per page
   * @param filters Object containing filter criteria
   * @param orderBy Order by criteria, default is 'Popularity'
   * @param name Game name to search
   * @returns Observable with the response
   */
  getGames(pageNumber?: number, pageSize?: number, filters?: any, orderBy?: any, name?: string) {
    // Build API URL dynamically
    let apiUrl = `${environment.apiUrl}/announcement/announcements?`;
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

    return this.http.get(apiUrl).pipe(
        map((res: any) => res),
        catchError((error: Error) => throwError(() => error))
    );
  }
}
