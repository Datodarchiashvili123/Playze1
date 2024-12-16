import {Component, Inject, OnDestroy, OnInit, PLATFORM_ID, Renderer2,} from "@angular/core";
import {GameDetailsService} from "./game-details.service";
import {ActivatedRoute} from "@angular/router";
import {Subscription} from "rxjs";
import {DomSanitizer, Meta, Title} from "@angular/platform-browser";
import {SlickCarouselModule} from "ngx-slick-carousel";
import {isPlatformBrowser, NgForOf, NgIf, NgOptimizedImage,} from "@angular/common";
import {GameDetailCardComponent} from "../../shared/game-detail-card/game-detail-card.component";

@Component({
    selector: "app-game-details",
    standalone: true,
    imports: [
        SlickCarouselModule,
        NgForOf,
        NgIf,
        NgOptimizedImage,
        GameDetailCardComponent,
    ],
    templateUrl: "./game-details.component.html",
    styleUrls: ["./game-details.component.scss"],
})
export class GameDetailsComponent implements OnInit, OnDestroy {
    mainSlideConfig = {
        slidesToShow: 1,
        slidesToScroll: 1,
        infinite: true,
        arrows: true,
        fade: true,
        asNavFor: ".thumbs",
    };

    thumbnailSlideConfig = {
        slidesToShow: 5,
        infinite: true,
        slidesToScroll: 1,
        asNavFor: ".main",
        dots: false,
        focusOnSelect: true,
        arrows: true,
        responsive: [
            {
                breakpoint: 1318,
                settings: {
                    slidesToShow: 4.5,
                },
            },
            {
                breakpoint: 1218,
                settings: {
                    slidesToShow: 4.25,
                },
            },
            {
                breakpoint: 1177,
                settings: {
                    slidesToShow: 4,
                },
            },
            {
                breakpoint: 1133,
                settings: {
                    slidesToShow: 3.75,
                },
            },
            {
                breakpoint: 1088,
                settings: {
                    slidesToShow: 3.5,
                },
            },
            {
                breakpoint: 1047,
                settings: {
                    slidesToShow: 3.25,
                },
            },
            {
                breakpoint: 998,
                settings: {
                    slidesToShow: 3,
                },
            },
            {
                breakpoint: 953,
                settings: {
                    slidesToShow: 2.75,
                },
            },
            {
                breakpoint: 900,
                settings: {
                    slidesToShow: 2.5,
                },
            },
            {
                breakpoint: 872,
                settings: {
                    slidesToShow: 2.25,
                },
            },
            {
                breakpoint: 820,
                settings: {
                    slidesToShow: 2,
                },
            },
            {
                breakpoint: 779,
                settings: {
                    slidesToShow: 1.9,
                },
            },
            {
                breakpoint: 768,
                settings: {
                    slidesToShow: 2.75,
                },
            },
        ],
    };

    gameId: string | null = null;
    game: any;
    gallery: any;
    sanitizedAboutTheGame: any;
    offers: any;
    private routeSub: Subscription | undefined;

    constructor(
        @Inject(PLATFORM_ID) private platformId: Object,
        private route: ActivatedRoute,
        private gameDetailsService: GameDetailsService,
        private sanitizer: DomSanitizer,
        private titleService: Title,
        private metaService: Meta,
        private renderer: Renderer2 // Inject Renderer2 for DOM manipulation
    ) {
        this.gameId = this.route.snapshot.paramMap.get("id");
    }

    ngOnInit() {
        this.routeSub = this.route.params.subscribe((params) => {
            this.gameId = params["id"];
            this.loadGameDetail(this.gameId);
            this.loadGalleryDetail(this.gameId);
            this.loadGameOffers(this.gameId);
        });
    }

    loadGameDetail(gameId: any) {
        this.gameDetailsService.getGameDetails(gameId).subscribe((res) => {
            this.game = res;
            this.sanitizedAboutTheGame = this.sanitizer.bypassSecurityTrustHtml(
                this.game.about.aboutTheGame
            );

            // Set Meta Tags dynamically when game details are loaded
            this.updateMetaTags();
        });
    }

    loadGalleryDetail(gameId: any) {
        this.gameDetailsService.getGameGallery(gameId).subscribe({
            next: (res: any) => {
                this.gallery = res.galleryContent;
            },
        });
    }

    loadGameOffers(gameId: any) {
        this.gameDetailsService.getGameOffers(gameId).subscribe({
            next: (res: any) => {
                this.offers = res.deals[0];
            },
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
            {name: "description", content: description},
            {name: "keywords", content: keywords},
        ]);

        // Add or update the canonical tag
        if (isPlatformBrowser(this.platformId)) {
            this.setCanonicalURL(window.location.href); // Set the canonical URL to the current page URL
        }
    }

    // Method to remove existing meta tags
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

    // Method to dynamically set the canonical URL
    setCanonicalURL(url: string) {
        const link: HTMLLinkElement = this.renderer.createElement("link");
        link.setAttribute("rel", "canonical");
        link.setAttribute("href", url);

        // Remove any existing canonical tag before adding a new one
        const existingCanonical = document.querySelector('link[rel="canonical"]');
        if (existingCanonical) {
            this.renderer.removeChild(document.head, existingCanonical);
        }

        this.renderer.appendChild(document.head, link);
    }

    ngOnDestroy() {
        if (this.routeSub) {
            this.routeSub.unsubscribe();
        }
    }
}
