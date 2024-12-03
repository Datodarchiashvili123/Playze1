import {Component} from '@angular/core';
import {RouterOutlet} from '@angular/router';
import {HeaderComponent} from "./header/header.component";
import {NgOptimizedImage} from "@angular/common";
import {TagComponent} from "./shared/tag/tag.component";
import {FiltersComponent} from "./shared/blocks/filters/filters.component";
import {FooterComponent} from "./footer/footer.component";
import {SearchDropdownComponent} from "./shared/search-dropdown/search-dropdown.component";

@Component({
    selector: 'app-root',
    imports: [RouterOutlet, NgOptimizedImage, HeaderComponent, TagComponent, FiltersComponent, FooterComponent, SearchDropdownComponent],
    templateUrl: './app.component.html',
    styleUrl: './app.component.scss'
})
export class AppComponent {
    title = 'play';
}
