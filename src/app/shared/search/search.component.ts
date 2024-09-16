import {Component, OnInit} from '@angular/core';
import {AsyncPipe, NgOptimizedImage} from "@angular/common";
import {SearchService} from "../../services/search.service";
import {FormsModule} from "@angular/forms";

@Component({
    selector: 'app-search',
    standalone: true,
    imports: [
        NgOptimizedImage,
        AsyncPipe,
        FormsModule
    ],
    templateUrl: './search.component.html',
    styleUrl: './search.component.scss'
})
export class SearchComponent implements OnInit {
    searchInput = '';

    constructor(private searchService: SearchService) {
    }  // Inject the service


    ngOnInit() {
        this.searchService.searchInput$.subscribe(inputValue => {
            this.searchInput = inputValue;
        });
    }

    onInput(event: Event) {
        const inputValue = (event.target as HTMLInputElement).value;
        this.searchService.updateSearchInput(inputValue);
        this.onFocus()// Emit input value to the service
    }

    onFocus() {
        this.searchService.updateInputFocus(true);
    }

    onBlur() {
        setTimeout(() => this.searchService.updateInputFocus(false), 200);
    }
}

