import {Component, Input, OnChanges, OnInit, SimpleChanges} from '@angular/core';
import {GameDetailCardService} from "../game-detail-card/game-detail-card.service";

@Component({
  selector: 'app-game-item-hover',
  standalone: true,
  imports: [],
  templateUrl: './game-item-hover.component.html',
  styleUrl: './game-item-hover.component.scss'
})
export class GameItemHoverComponent implements OnInit, OnChanges {

  @Input() gameId: any;
  @Input() gameName: any;
  @Input() gameImage: any;
  loadData = false;

  gameDetailCard: any;

  constructor(private gameDetailCardService: GameDetailCardService) {
  }

  ngOnInit() {
    if (this.gameId) {
      this.getGameDetailCardOnHover()
    }
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['gameId'] && this.gameId) {
      this.getGameDetailCardOnHover();
    }
  }

  getGameDetailCardOnHover() {
    this.gameDetailCardService?.getGameDetailCard(this.gameId).subscribe((res: any) => {
      this.gameDetailCard = res;
      this.loadData = true;

    })
  }
}
