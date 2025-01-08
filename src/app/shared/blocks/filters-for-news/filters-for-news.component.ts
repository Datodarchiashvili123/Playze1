import {Component, EventEmitter, HostListener, Inject, OnInit, Output, PLATFORM_ID} from '@angular/core';
import {FilterComponent} from "../../filter/filter.component";
import {FiltersService} from "../../../services/filters.service";
import {ReactiveFormsModule} from "@angular/forms";
import {isPlatformBrowser} from '@angular/common';

type FilterType = 'price' | 'developers' | 'publishers' | 'genres' | 'primaryPlatforms' | 'announcementTypes';


@Component({
    selector: 'app-filters-for-news',
    imports: [
        FilterComponent,
        ReactiveFormsModule
    ],
    templateUrl: './filters-for-news.component.html',
    styleUrl: './filters-for-news.component.scss'
})
export class FiltersForNewsComponent implements OnInit {
    developers: any;
    publishers: any;
    platforms: any;
    searchValue: string = '';
    private debounceTimer: any;
    mobileSize: boolean;


    @Output() filtersChanged = new EventEmitter<any>();
    @Output() searchChanged = new EventEmitter<string>();


    genres = [
        {
            "announcementId": "1C2B7A21-AB82-4A01-9B5E-0CF5FDF51BE7",
            "name": "bundles",
            "color": "#ea53b2"
        },
        {
            "announcementId": "E15F6B19-2FE7-4A17-884B-1EC9C70148C5",
            "name": "gaming news",
            "color": "#f50000"
        },
        {
            "announcementId": "DE186037-1D8A-47F5-A006-3CFBDAEF26FD",
            "name": "blog",
            "color": "#0008ff"
        },
        {
            "announcementId": "FA4583DD-ADDE-4E1C-9EE3-99AF29C931EC",
            "name": "deals",
            "color": "#00ff1e"
        }
    ]

    constructor(
        private filtersService: FiltersService,
        @Inject(PLATFORM_ID) private platformId: Object,
    ) {
        this.mobileSize = isPlatformBrowser(this.platformId) ? window.innerWidth <= 768 : false;
    }

    ngOnInit() {
        this.filtersService.getGenres().subscribe((res: any) => {
            console.log(res);
            // this.genres = res.genres;
        });
    }


    // Example filter data structure
    filters: Partial<Record<FilterType, any>> = {
        price: '',
        developers: [],
        publishers: [],
        genres: [],
        primaryPlatforms: [],
        announcementTypes:[]
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
