import {Component, OnInit} from '@angular/core';
import {NewsDetailsService} from "./news-details.service";
import {ActivatedRoute, RouterLink} from "@angular/router";
import {Subscription} from "rxjs";
import {DomSanitizer} from "@angular/platform-browser";
import {NgOptimizedImage, NgStyle} from "@angular/common";

@Component({
  selector: 'app-news-details',
  imports: [
    NgStyle,
    NgOptimizedImage,
    RouterLink
  ],
  templateUrl: './news-details.component.html',
  styleUrl: './news-details.component.scss'
})
export class NewsDetailsComponent implements OnInit {
  newsId: string | null = null;
  private routeSub: Subscription | undefined;
  news:any;
  hotNews:any;
  sanitizedAboutTheNews: any;

  constructor(
      private newsDetails: NewsDetailsService,
      private route: ActivatedRoute,
      private sanitizer: DomSanitizer,

  ) {
    this.newsId = this.route.snapshot.paramMap.get("id");
  }
ngOnInit() {
  this.routeSub = this.route.params.subscribe((params) => {
    this.newsId = params["id"];
    this.loadNewsDetail(this.newsId);
    this.loadHotNews(this.newsId);
  });
}

  loadNewsDetail(gameId: any) {
    this.newsDetails.newsDetails(gameId).subscribe((res) => {
      this.news = res;
      this.sanitizedAboutTheNews = this.sanitizer.bypassSecurityTrustHtml(
          this.news.contentHtml
      );
    });
  }

  loadHotNews(gameId: any) {
    this.newsDetails.hotNews(gameId).subscribe((res) => {
      console.log(res, 'resss');
      this.hotNews = res.hotAnnouncements;
    });
  }

  getBorderColorWithOpacity(color: string, opacity: number): string {
    // Assuming `color` is a valid hex code like "#3498db"
    if (color.startsWith('#')) {
      const hex = color.replace('#', '');
      const r = parseInt(hex.substring(0, 2), 16);
      const g = parseInt(hex.substring(2, 4), 16);
      const b = parseInt(hex.substring(4, 6), 16);
      return `rgba(${r}, ${g}, ${b}, ${opacity})`;
    }
    return color; // Fallback for named colors or invalid input
  }

}
