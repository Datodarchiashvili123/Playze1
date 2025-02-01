import {Component} from '@angular/core';
import {RouterOutlet} from '@angular/router';
import {HeaderComponent} from "./header/header.component";
import {FooterComponent} from "./footer/footer.component";
import {SearchDropdownComponent} from "./shared/search-dropdown/search-dropdown.component";
import {SeoService} from "./services/seo.service";
import { Router, NavigationEnd } from '@angular/router';
import {filter} from "rxjs";


@Component({
    selector: 'app-root',
    imports: [RouterOutlet, HeaderComponent, FooterComponent, SearchDropdownComponent],
    templateUrl: './app.component.html',
    styleUrl: './app.component.scss'
})
export class AppComponent {
    title = 'play';

    constructor(private router: Router, private seoService: SeoService) {
    }

    ngOnInit(): void {
        // ამოწმეთ ყოველი მარშრუტის ცვლილება
        this.router.events
            .pipe(filter(event => event instanceof NavigationEnd))
            .subscribe((event: NavigationEnd) => {
                // გამოიყენეთ სერვისის საშუალებით მიმდინარე URL-ის საფუძველზე შესაბამისი canonical URL-ის განახლება
                const canonicalUrl = `https://playze.io${event.urlAfterRedirects}`;
                this.seoService.setCanonicalURL(canonicalUrl);
            });
    }
}