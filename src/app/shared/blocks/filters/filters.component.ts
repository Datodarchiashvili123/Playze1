import {Component, EventEmitter, HostListener, Inject, OnInit, Output, PLATFORM_ID} from '@angular/core';
import {FilterComponent} from "../../filter/filter.component";
import {FiltersService} from "../../../services/filters.service";
import {ReactiveFormsModule} from "@angular/forms";
import {isPlatformBrowser} from '@angular/common';

type FilterType = 'price' | 'developers' | 'publishers' | 'genres' | 'primaryPlatforms';


@Component({
    selector: 'app-filters',
    imports: [
        FilterComponent,
        ReactiveFormsModule
    ],
    templateUrl: './filters.component.html',
    styleUrl: './filters.component.scss'
})
export class FiltersComponent implements OnInit {
    genres = [
        {
            genreId: 1,
            name: "Adventure"
        }];
    developers: any;
    publishers: any;
    platforms: any;
    searchValue: string = '';
    private debounceTimer: any;
    mobileSize: boolean;


    @Output() filtersChanged = new EventEmitter<any>();
    @Output() searchChanged = new EventEmitter<string>();


    constructor(
        private filtersService: FiltersService,
        @Inject(PLATFORM_ID) private platformId: Object,
    ) {
        this.mobileSize = isPlatformBrowser(this.platformId) ? window.innerWidth <= 768 : false;
    }

    ngOnInit() {
        this.filtersService.getGenres().subscribe((res: any) => {
            console.log(res);
            this.genres = res.genres;
        });
        this.filtersService.getDevelopers().subscribe((res: any) => {
            console.log(res);
            this.developers = res.developers;
        });
        this.filtersService.getPublishers().subscribe((res: any) => {
            console.log(res);
            this.publishers = res.publishers;
        });
        this.filtersService.getPlatforms().subscribe((res: any) => {
            console.log(res);
            this.platforms = res.platforms;
        })
    }


    // Example filter data structure
    filters: Partial<Record<FilterType, any>> = {
        price: '',
        developers: [],
        publishers: [],
        genres: [],
        primaryPlatforms: [],
    };

    onFilterChange(filterType: FilterType, value: any) {
        this.filters[filterType] = value;
        this.filtersChanged.emit(this.filters);
    }


    onSearchChange(event: Event) {
        const input = event.target as HTMLInputElement;
        this.searchValue = input.value;

        // Clear the previous debounce timer
        if (this.debounceTimer) {
            clearTimeout(this.debounceTimer);
        }

        // Set a new debounce timer with 0.5 seconds delay
        this.debounceTimer = setTimeout(() => {
            this.searchChanged.emit(this.searchValue);
        }, 500); // 500 milliseconds delay
    }

    @HostListener('window:resize', ['$event'])
    onResize(): void {
        if (isPlatformBrowser(this.platformId)) {
            this.mobileSize = window.innerWidth <= 768;
        }
    }
}
