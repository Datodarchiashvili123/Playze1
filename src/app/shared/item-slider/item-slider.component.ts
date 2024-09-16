import {Component, Input, ViewEncapsulation} from '@angular/core';
import {SlickCarouselModule} from "ngx-slick-carousel";
import {NgOptimizedImage} from "@angular/common";
import {RouterLink} from "@angular/router";

@Component({
  selector: 'app-item-slider',
  standalone: true,
    imports: [
        SlickCarouselModule,
        NgOptimizedImage,
        RouterLink,

    ],
  templateUrl: './item-slider.component.html',
  styleUrl: './item-slider.component.scss',
  encapsulation: ViewEncapsulation.None
})
export class ItemSliderComponent {
  @Input() slides: any = [];



  slideConfig = {
    slidesToShow: 4.7,
    slidesToScroll: 1,
    infinite: false,
    responsive: [
      {
        breakpoint: 768, // Adjust breakpoint as needed
        settings: {
          slidesToShow: 2.5 // Adjust number of slides for smaller screens
        }
      }
      // Add more breakpoints and settings as needed
    ]
  };

  // addSlide() {
  //   this.slides.push({img: "http://placehold.it/350x150/777777"})
  // }

  removeSlide() {
    this.slides.length = this.slides.length - 1;
  }

  slickInit(e: any) {
    console.log('slick initialized');
  }

  breakpoint(e: any) {
    console.log('breakpoint');
  }

  afterChange(e: any) {
    console.log('afterChange');
  }

  beforeChange(e: any) {
    console.log('beforeChange');
  }

  protected readonly JSON = JSON;
}
