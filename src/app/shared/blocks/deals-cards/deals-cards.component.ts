import {Component, Input} from '@angular/core';
import {DealsCardComponent} from "../../deals-card/deals-card.component";
import {RouterLink} from "@angular/router";

@Component({
    selector: 'app-deals-cards',
    imports: [
        DealsCardComponent,
        RouterLink
    ],
    templateUrl: './deals-cards.component.html',
    styleUrl: './deals-cards.component.scss'
})
export class DealsCardsComponent {
  @Input() title: any;
  @Input() dealsCards: any;

}
