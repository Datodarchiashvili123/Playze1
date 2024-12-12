import {Component, inject, Inject, OnInit, PLATFORM_ID, Renderer2} from '@angular/core';
import {isPlatformBrowser, NgOptimizedImage, NgStyle} from "@angular/common";
import {RouterLink} from "@angular/router";
import {PaginationComponent} from "../../shared/pagination/pagination.component";
import {Meta, Title} from "@angular/platform-browser";
import {TagComponent} from "../../shared/tag/tag.component";
import {FiltersComponent} from "../../shared/blocks/filters/filters.component";
import {GamesService} from "../games/games.service";

@Component({
    selector: 'app-news',
    imports: [
        NgOptimizedImage,
        RouterLink,
        NgStyle,
        PaginationComponent,
        TagComponent,
        FiltersComponent
    ],
    templateUrl: './news.component.html',
    styleUrl: './news.component.scss'
})
export class NewsComponent implements OnInit {
    totalPages = 0;
    currentPage = 1;
    news: any;
    currentFilters: any = {};
    orderBy: string = 'Popularity';
    searchValue: string = '';
    mobileSize: boolean;


    constructor(
        @Inject(PLATFORM_ID) private platformId: Object,
        @Inject(GamesService) private newsService: GamesService,
        private titleService: Title,
        private metaService: Meta,
        private renderer: Renderer2,  // Inject Renderer2 for DOM manipulation
    ) {
        this.mobileSize = isPlatformBrowser(this.platformId) ? window.innerWidth <= 768 : false;
    }

    ngOnInit() {
        this.loadNews(this.currentPage, this.currentFilters, this.orderBy, this.searchValue);

        // Set static meta title
        this.titleService.setTitle('Popular Games - Discover Top-Rated Titles and Must-Play Releases');

        // Set canonical URL
        if (isPlatformBrowser(this.platformId)) {
            this.setCanonicalURL(window.location.href);  // Set the canonical URL to the current page URL
        }
    }

    loadNews(page: number, filters: any = {}, orderBy?: string, name?: string) {
        this.newsService.cancelRequest();
        this.newsService.getGames(page, 10, filters, orderBy, name).subscribe((data: any) => {
            this.news = data.results;
            this.totalPages = data.totalPages;
            this.currentPage = data.currentPage;
            // Dynamically update meta tags based on the loaded games
            this.updateMetaTags(this.news);
        });
    }

    updateMetaTags(news: any[]) {
        const gameNames = news.map(news => news.name).join(', ');
        const baseKeywords = 'popular games, top-rated video games, new game releases, best game deals, game discounts, cheap video games, trending video games, must-play games, video game offers, gaming discounts, PC games on sale, console games deals, Xbox game deals, PlayStation game deals, Steam game sales, playze.io';
        const dynamicKeywords = `${baseKeywords}, ${gameNames}`;

        this.metaService.updateTag({name: 'keywords', content: dynamicKeywords});
        this.metaService.updateTag({
            name: 'description',
            content: 'Explore the most popular games across all platforms! Check out top-rated titles, trending releases, and fan-favorite games. Get deals and start playing now!'
        });
    }

    onPageChange(newPage: number) {
        this.currentPage = newPage;
        this.loadNews(this.currentPage, this.currentFilters, this.orderBy, this.searchValue); // Fetch the data for the new page
    }

    handleFilterChange(filters: any) {
        this.currentFilters = filters;
        this.currentPage = 1; // Update the current filters
        this.loadNews(1, this.currentFilters, this.orderBy, this.searchValue);
    }

    onSortChange(event: any) {
        this.orderBy = event;
        this.loadNews(this.currentPage, this.currentFilters, this.orderBy, this.searchValue);
    }

    handleSearchChange(search: string) {
        this.searchValue = search;
        this.loadNews(1, this.currentFilters, this.orderBy, this.searchValue);
    }

    getBorderColorWithOpacity(color: string, opacity: number): string {
        // Assuming `color` is a valid hex code like "#3498db"
        if (color.startsWith('#')) {
            const hex = color.replace('#', '');
            const r = parseInt(hex.substring(0, 2), 16);
            const g = parseInt(hex.substring(2, 4), 16);
            const b = parseInt(hex.substring(4, 6), 16);
            return `rgba(${r}, ${g}, ${b}, ${opacity})`;
        }
        return color; // Fallback for named colors or invalid input
    }


    setCanonicalURL(url: string) {
        const link: HTMLLinkElement = this.renderer.createElement('link');
        link.setAttribute('rel', 'canonical');
        link.setAttribute('href', url);

        // Remove any existing canonical tag before adding a new one
        const existingCanonical = document.querySelector('link[rel="canonical"]');
        if (existingCanonical) {
            this.renderer.removeChild(document.head, existingCanonical);
        }

        this.renderer.appendChild(document.head, link);
    }

}
