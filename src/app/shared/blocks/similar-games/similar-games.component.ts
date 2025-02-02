import {Component, Input} from '@angular/core';
import {GamesService} from "../../../pages/games/games.service";
import {NgOptimizedImage} from "@angular/common";
import {RouterLink} from "@angular/router";
import {DealsCardComponent} from "../../deals-card/deals-card.component";
import {SlickCarouselModule} from "ngx-slick-carousel";

@Component({
  selector: 'app-similar-games',
  imports: [
    NgOptimizedImage,
    RouterLink,
    DealsCardComponent,
    SlickCarouselModule
  ],
  templateUrl: './similar-games.component.html',
  styleUrl: './similar-games.component.scss'
})
export class SimilarGamesComponent {

  @Input() games: any;

  constructor(private gamesService: GamesService) {

  }

}
