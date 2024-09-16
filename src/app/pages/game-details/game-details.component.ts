import {Component, OnDestroy, OnInit} from '@angular/core';
import {GameDetailsService} from "./game-details.service";
import {ActivatedRoute} from "@angular/router";
import {Subscription} from "rxjs";
import {DomSanitizer, Meta, Title} from "@angular/platform-browser"; // Add Meta and Title imports
import {SlickCarouselModule} from "ngx-slick-carousel";
import {NgForOf, NgIf, NgOptimizedImage} from "@angular/common";
import {SearchDropdownComponent} from "../../shared/search-dropdown/search-dropdown.component";
import {GameDetailCardComponent} from "../../shared/game-detail-card/game-detail-card.component";

@Component({
    selector: 'app-game-details',
    standalone: true,
    imports: [
        SlickCarouselModule,
        NgForOf,
        NgIf,
        NgOptimizedImage,
        SearchDropdownComponent,
        GameDetailCardComponent,
    ],
    templateUrl: './game-details.component.html',
    styleUrl: './game-details.component.scss'
})
export class GameDetailsComponent implements OnInit, OnDestroy {

    mainSlideConfig = {
        slidesToShow: 1,
        slidesToScroll: 1,
        infinite: true,
        arrows: true,
        fade: true,
        asNavFor: '.thumbs'
    };

    thumbnailSlideConfig = {
        slidesToShow: 5,
        infinite: true,
        slidesToScroll: 1,
        asNavFor: '.main',
        dots: false,
        focusOnSelect: true,
        arrows: true,

        responsive: [
            {
                breakpoint: 768, // Adjust breakpoint as needed
                settings: {
                    slidesToShow: 2.5 // Adjust number of slides for smaller screens
                }
            }
        ]
    };

    gameId: string | null = null;
    game: any;
    gallery: any;
    sanitizedAboutTheGame: any;
    offers: any;
    private routeSub: Subscription | undefined;

    constructor(
        private route: ActivatedRoute,
        private gameDetailsService: GameDetailsService,
        private sanitizer: DomSanitizer,
        private titleService: Title, // Inject Title service
        private metaService: Meta    // Inject Meta service
    ) {
        this.gameId = this.route.snapshot.paramMap.get('id');
    }

    ngOnInit() {
        this.routeSub = this.route.params.subscribe(params => {
            this.gameId = params['id'];
            this.loadGameDetail(this.gameId);
            this.loadGalleryDetail(this.gameId);
            this.loadGameOffers(this.gameId);
        });
    }

    loadGameDetail(gameId: any) {
        this.gameDetailsService.getGameDetails(gameId).subscribe(
            res => {
                this.game = res;
                console.log(this.game);
                this.sanitizedAboutTheGame = this.sanitizer.bypassSecurityTrustHtml(this.game.about.aboutTheGame);

                // Set Meta Tags dynamically when game details are loaded
                this.updateMetaTags();
            }
        );
    }

    loadGalleryDetail(gameId: any) {
        this.gameDetailsService.getGameGallery(gameId).subscribe({
            next: (res: any) => {
                this.gallery = res.galleryContent;
            }
        });
    }

    loadGameOffers(gameId: any) {
        this.gameDetailsService.getGameOffers(gameId).subscribe({
            next: (res: any) => {
                console.log(res, ' res ');
                this.offers = res.deals[0];
            }
        });
    }

// Method to update meta tags dynamically based on game data
    updateMetaTags() {
        const title = `${this.game.name} - Buy Now at Best Price!`;
        const description = `Get the best deals on ${this.game.name}. Explore reviews, screenshots, and offers for ${this.game.name} and similar games.`;
        const keywords = `${this.game.name}, buy ${this.game.name}, ${this.game.name} deals, video game deals, best price for ${this.game.name}, gaming offers`;

        // Set the title
        this.titleService.setTitle(title);

        // Remove existing meta tags to avoid duplicates
        this.removeExistingMetaTags();

        // Add new meta tags
        this.metaService.addTags([
            { name: 'description', content: description },
            { name: 'keywords', content: keywords },
        ]);
    }

// Method to remove existing meta tags
    removeExistingMetaTags() {
        // Remove the description tag if it exists
        const descriptionTag = this.metaService.getTag('name="description"');
        if (descriptionTag) {
            this.metaService.removeTag('name="description"');
        }

        // Remove the keywords tag if it exists
        const keywordsTag = this.metaService.getTag('name="keywords"');
        if (keywordsTag) {
            this.metaService.removeTag('name="keywords"');
        }
    }


    ngOnDestroy() {
        if (this.routeSub) {
            this.routeSub.unsubscribe();
        }
    }
}
