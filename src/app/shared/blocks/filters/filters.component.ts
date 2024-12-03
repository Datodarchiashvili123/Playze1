import {Component, EventEmitter, OnInit, Output} from '@angular/core';
import {SearchComponent} from "../../search/search.component";
import {TagComponent} from "../../tag/tag.component";
import {FilterComponent} from "../../filter/filter.component";
import {FiltersService} from "../../../services/filters.service";
import {ReactiveFormsModule} from "@angular/forms";

type FilterType = 'price' | 'developers' | 'publishers' | 'genres' | 'primaryPlatforms';


@Component({
    selector: 'app-filters',
    imports: [
        SearchComponent,
        TagComponent,
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


    @Output() filtersChanged = new EventEmitter<any>();
    @Output() searchChanged = new EventEmitter<string>();


    constructor(private filtersService: FiltersService) {

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
}
