import {Component, OnInit, ViewEncapsulation} from '@angular/core';
import {NgOptimizedImage} from "@angular/common";
import {SlickCarouselModule} from "ngx-slick-carousel";
import {ItemSliderComponent} from "../../shared/item-slider/item-slider.component";
import {DealsCardsComponent} from "../../shared/blocks/deals-cards/deals-cards.component";
import {HomeService} from "./home.service";
import {RouterLink} from "@angular/router";
import {Meta, Title} from "@angular/platform-browser";

@Component({
    selector: 'app-home',
    imports: [
        NgOptimizedImage,
        SlickCarouselModule,
        ItemSliderComponent,
        DealsCardsComponent,
        RouterLink
    ],
    templateUrl: './home.component.html',
    styleUrls: ['./home.component.scss'],
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
    ) {
    }

    ngOnInit() {
        this.titleService.setTitle('Game Deals - Best Discount and Offers on Top Games');

        this.updateMetaTags();

        this.homeService.getTopGameCards().subscribe((x: any) => {
            this.gamesData = x.popularGames;
            this.sliderData = x.popularGames.map((game: any) => ({
                title: game.name,
                img: game.headerImageUrl,
                price: game.lowestPriceText,
                hasPrice: game.hasPrice,
                gameId: game.gameId,
                urlName: game.urlName
            }));

            const keywords = x.popularGames.map((game: any) => game.name).join(', ');

            this.updateMetaTags(keywords);
        });

        this.homeService.getDealCards(1).subscribe((x: any) => {
            this.newDeals = x.dealCards;
        });

        this.homeService.getDealCards(2).subscribe((x: any) => {
            this.bestDeals = x.dealCards;
        });
    }

    updateMetaTags(keywords = '') {
        const description = `Find the best game deals on top titles with huge discounts! Explore daily offers and save big on the latest video games for all platforms. Don't miss out!`;

        this.removeExistingMetaTags();

        this.metaService.addTags([
            {name: 'description', content: description},
            {
                name: 'keywords',
                content: `${keywords}, popular games, video game deals, new game releases, game discounts, best game deals, cheap video games, top-rated games, gaming offers, latest game discounts, game sales, PC games, console games, Xbox deals, PlayStation deals, Steam deals, game bundles, playze.io`
            }
        ]);
    }

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
