import { Injectable } from '@angular/core';
import {BehaviorSubject} from "rxjs";
import { HttpClient } from "@angular/common/http";
import {environment} from "../../environments/environment";

@Injectable({
  providedIn: 'root'
})
export class SearchService {
  private searchInputSubject = new BehaviorSubject<string>('');
  searchInput$ = this.searchInputSubject.asObservable();

  private isInputFocusedSubject = new BehaviorSubject<boolean>(false);
  isInputFocused$ = this.isInputFocusedSubject.asObservable();

  private isVisibleSubject = new BehaviorSubject<boolean>(true);
  isVisible$ = this.isVisibleSubject.asObservable();

  constructor(private http: HttpClient) {
  }

  updateIsVisible(isVisible: boolean) {
    this.isVisibleSubject.next(isVisible);
  }

  updateSearchInput(inputValue: string) {
    this.searchInputSubject.next(inputValue);
  }

  updateInputFocus(isFocused: boolean) {
    this.isInputFocusedSubject.next(isFocused);
  }

  getSuggestions() {
      return  this.http.get(`${environment.apiUrl}/game/trendingsearches`)
  }

  searchGames(game:string){
    return  this.http.get(`${environment.apiUrl}/game/searchgames?SearchQuery=${game}`)
  }

}
