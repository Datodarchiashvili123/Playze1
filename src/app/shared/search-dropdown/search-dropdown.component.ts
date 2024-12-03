import {Component, ElementRef, HostListener, Inject, OnInit, PLATFORM_ID} from '@angular/core';
import {SearchService} from "../../services/search.service";
import {animate, state, style, transition, trigger} from "@angular/animations";
import {CommonModule, isPlatformBrowser, NgOptimizedImage} from "@angular/common";
import {provideAnimations} from "@angular/platform-browser/animations";
import {RouterLink} from "@angular/router";
import {ClickOutsideDirective} from "../../directives/click-outside.directive";

@Component({
    selector: 'app-search-dropdown',
    standalone: true,
    imports: [CommonModule, NgOptimizedImage, RouterLink, ClickOutsideDirective],  // Import CommonModule for basic Angular directives
    providers: [provideAnimations()],  // Provide animations without BrowserAnimationsModule
    templateUrl: './search-dropdown.component.html',
    styleUrl: './search-dropdown.component.scss',
    animations: [
        trigger('dropdownState', [
            state('hidden', style({
                opacity: 0,
                width: '0px',
                height: '0px',
                overflow: 'hidden'
            })),
            state('visible', style({
                opacity: 1,
                width: '700px',  // Increase width for visibility
                height: '*', // Increase height for visibility
                backgroundColor: '#1B1B1B',  // Add background color to make it more visible
                border: '2px solid #C9FF58'
            })),
            transition('hidden => visible', [
                animate('300ms ease-out')  // Slow down to 1 second for testing
            ]),
            transition('visible => hidden', [
                animate('200ms ease-in')  // Slow down to 1 second for testing
            ])
        ])
    ]
})
export class SearchDropdownComponent implements OnInit {
    searchInput: string | undefined;
    isInputFocused: boolean | undefined;
    isBrowser: boolean;
    suggestions: any;
    games: any;
    isVisible: boolean = false;


    constructor
    (
        @Inject(PLATFORM_ID) private platformId: Object,
        public searchService: SearchService,
        private elementRef: ElementRef
    ) {
        this.isBrowser = isPlatformBrowser(this.platformId);

    }  // Inject the service

    ngOnInit() {
        this.searchService.searchInput$.subscribe(inputValue => {
            this.searchInput = inputValue;
            console.log('Search input in dropdown:', this.searchInput);
            // Handle the search input here, e.g., filter dropdown options
        });
        this.searchService.isInputFocused$.subscribe(isFocused => {
            this.isInputFocused = isFocused;
        });
        this.searchService.isVisible$.subscribe(isVisible => {
            this.isVisible = isVisible;
        });
        this.searchService.getSuggestions().subscribe((suggestions: any) => {
            this.suggestions = suggestions.trendingSearches;
            console.log('Suggestions from dropdown:', suggestions);
        })

        this.searchService.searchInput$.subscribe(input => {
            if (input.length > 2) {
                this.searchService.searchGames(input).subscribe((res: any) => {
                    this.games = res.searchedGames;
                    console.log(this.games, 'this')
                })
            }
        })
    }

    select(item: any) {
        this.searchService.updateSearchInput(item);
    }


    updateIsVisible() {
        this.isVisible = false;

    }

    closeDropdown() {
        this.isVisible = false;
    }

    // Listen for clicks on the entire document
    @HostListener('document:click', ['$event'])
    handleClickOutside(event: MouseEvent) {
        // Check if the click was outside the dropdown
        if (!this.elementRef.nativeElement.contains(event.target) && !this.isInputFocused) {
            this.isVisible = false;
        } else if (!this.elementRef.nativeElement.contains(event.target) && this.isInputFocused) {
            this.isVisible = true;
        }
    }
}

