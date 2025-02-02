import {Component, Inject, PLATFORM_ID} from '@angular/core';
import {RouterOutlet} from '@angular/router';
import {HeaderComponent} from "./header/header.component";
import {FooterComponent} from "./footer/footer.component";
import {SearchDropdownComponent} from "./shared/search-dropdown/search-dropdown.component";
import {SeoService} from "./services/seo.service";
import { Router, NavigationEnd } from '@angular/router';
import {filter} from "rxjs";
import {isPlatformBrowser} from "@angular/common";


@Component({
    selector: 'app-root',
    imports: [RouterOutlet, HeaderComponent, FooterComponent, SearchDropdownComponent],
    templateUrl: './app.component.html',
    styleUrl: './app.component.scss'
})
export class AppComponent {
    title = 'play';

    constructor(private router: Router, private seoService: SeoService, @Inject(PLATFORM_ID) private platformId: object) {}

    ngOnInit(): void {
        // მხოლოდ ბრაუზერში უნდა გაშვდეს ეს ლოგიკა
        if (isPlatformBrowser(this.platformId)) {
            this.router.events.pipe(filter(event => event instanceof NavigationEnd)).subscribe((event: NavigationEnd) => {
                const canonicalUrl = `https://playze.io${event.urlAfterRedirects}`;
                console.log('Canonical URL:', canonicalUrl);
                this.seoService.setCanonicalURL(canonicalUrl);
            });
        }
    }
}

