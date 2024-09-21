import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { NgOptimizedImage } from "@angular/common";
import { SlickCarouselModule } from "ngx-slick-carousel";
import { ItemSliderComponent } from "../../shared/item-slider/item-slider.component";
import { DealsCardComponent } from "../../shared/deals-card/deals-card.component";
import { DealsCardsComponent } from "../../shared/blocks/deals-cards/deals-cards.component";
import { HomeService } from "./home.service";
import { RouterLink } from "@angular/router";
import { SearchDropdownComponent } from "../../shared/search-dropdown/search-dropdown.component";
import { Meta, Title } from "@angular/platform-browser";
import { TransferState, makeStateKey } from '@angular/core';

// Define keys for TransferState caching
const GAMES_DATA_KEY = makeStateKey<any>('gamesData');
const NEW_DEALS_KEY = makeStateKey<any>('newDeals');
const BEST_DEALS_KEY = makeStateKey<any>('bestDeals');

@Component({
    selector: 'app-home',
    standalone: true,
    imports: [
        NgOptimizedImage,
        SlickCarouselModule,
        ItemSliderComponent,
        DealsCardComponent,
        DealsCardsComponent,
        RouterLink,
        SearchDropdownComponent
    ],
    templateUrl: './home.component.html',
    styleUrl: './home.component.scss',
    encapsulation: ViewEncapsulation.None
})
export class HomeComponent implements OnInit {

    gamesData: any;
    sliderData: any;
    newDeals = [];
    bestDeals = [];

    constructor(
        private homeService: HomeService,
        private titleService: Title,
        private metaService: Meta,
        private transferState: TransferState  // Inject TransferState to access the cached data
    ) {}

    ngOnInit() {
        this.titleService.setTitle('Game Deals - Best Discount and Offers on Top Games');
        this.updateMetaTags();

        // Check if data is already available in TransferState
        const cachedGamesData = this.transferState.get(GAMES_DATA_KEY, null);
        const cachedNewDeals = this.transferState.get(NEW_DEALS_KEY, null);
        const cachedBestDeals = this.transferState.get(BEST_DEALS_KEY, null);

        // If gamesData is cached, use it, otherwise fetch it
        if (cachedGamesData) {
            this.setGameData(cachedGamesData);
        } else {
            this.homeService.getTopGameCards().subscribe((x: any) => {
                this.setGameData(x);
                // Store the data in TransferState to cache it
                this.transferState.set(GAMES_DATA_KEY, x);
            });
        }

        // If newDeals is cached, use it, otherwise fetch it
        if (cachedNewDeals) {
            this.newDeals = cachedNewDeals;
        } else {
            this.homeService.getDealCards(1).subscribe((x: any) => {
                this.newDeals = x.dealCards;
                this.transferState.set(NEW_DEALS_KEY, this.newDeals);
            });
        }

        // If bestDeals is cached, use it, otherwise fetch it
        if (cachedBestDeals) {
            this.bestDeals = cachedBestDeals;
        } else {
            this.homeService.getDealCards(2).subscribe((x: any) => {
                this.bestDeals = x.dealCards;
                this.transferState.set(BEST_DEALS_KEY, this.bestDeals);
            });
        }
    }

    // Helper function to set game data
    setGameData(data: any) {
        this.gamesData = data.popularGames;
        this.sliderData = data.popularGames.map((game: any) => ({
            title: game.name,
            img: game.headerImageUrl,
            price: game.lowestPriceText,
            hasPrice: game.hasPrice,
            gameId: game.gameId
        }));

        const keywords = data.popularGames.map((game: any) => game.name).join(', ');
        this.updateMetaTags(keywords);
    }

    // Update meta tags dynamically
    updateMetaTags(keywords = '') {
        const description = `Find the best game deals on top titles with huge discounts! Explore daily offers and save big on the latest video games for all platforms. Don't miss out!`;
        this.removeExistingMetaTags();

        this.metaService.addTags([
            { name: 'description', content: description },
            {
                name: 'keywords',
                content: `${keywords}, popular games, video game deals, new game releases, game discounts, best game deals, cheap video games, top-rated games, gaming offers, latest game discounts, game sales, PC games, console games, Xbox deals, PlayStation deals, Steam deals, game bundles, playze.io`
            }
        ]);
    }

    // Remove existing meta tags
    removeExistingMetaTags() {
        const descriptionTag = this.metaService.getTag('name="description"');
        if (descriptionTag) {
            this.metaService.removeTag('name="description"');
        }

        const keywordsTag = this.metaService.getTag('name="keywords"');
        if (keywordsTag) {
            this.metaService.removeTag('name="keywords"');
        }
    }
}
