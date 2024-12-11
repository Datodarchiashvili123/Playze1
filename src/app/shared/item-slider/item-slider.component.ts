import { Component, Input, ViewEncapsulation } from "@angular/core";
import { SlickCarouselModule } from "ngx-slick-carousel";
import { NgOptimizedImage } from "@angular/common";
import { RouterLink } from "@angular/router";

@Component({
    selector: "app-item-slider",
    standalone: true,
    imports: [SlickCarouselModule, NgOptimizedImage, RouterLink],
    templateUrl: "./item-slider.component.html",
    styleUrl: "./item-slider.component.scss",
    encapsulation: ViewEncapsulation.None,
})
export class ItemSliderComponent {
    @Input() slides: any = [];

    slideConfig = {
        slidesToShow: 4.7,
        slidesToScroll: 1,
        infinite: false,
        responsive: [
            {
                breakpoint: 1341, // Adjust breakpoint as needed
                settings: {
                    slidesToShow: 4.4,
                    slidesToScroll: 1,
                    infinite: true,
                },
            },
            {
                breakpoint: 1261,
                settings: {
                    arrows: false,
                    slidesToShow: 4,
                    slidesToScroll: 1,
                    infinite: true,
                },
            },
            {
                breakpoint: 1163,
                settings: {
                    arrows: false,
                    slidesToShow: 3.7,
                    slidesToScroll: 1,
                },
            },
            {
                breakpoint: 1071,
                settings: {
                    arrows: false,
                    slidesToShow: 3.4,
                    slidesToScroll: 1,
                },
            },
            {
                breakpoint: 988,
                settings: {
                    arrows: false,
                    slidesToShow: 3.2,
                    slidesToScroll: 1,
                },
            },
            {
                breakpoint: 926,
                settings: {
                    arrows: false,
                    slidesToShow: 3,
                    slidesToScroll: 1,
                },
            },
            {
                breakpoint: 865,
                settings: {
                    arrows: false,
                    slidesToShow: 2.75,
                    slidesToScroll: 1,
                },
            },
            {
                breakpoint: 796,
                settings: {
                    arrows: false,
                    slidesToShow: 2.5,
                    slidesToScroll: 1,
                },
            },
            {
                breakpoint: 768,
                settings: {
                    arrows: false,
                    slidesToShow: 3.2,
                    slidesToScroll: 1,
                },
            },
            {
                breakpoint: 739,
                settings: {
                    arrows: false,
                    slidesToShow: 3,
                    slidesToScroll: 1,
                },
            },
            {
                breakpoint: 700,
                settings: {
                    arrows: false,
                    slidesToShow: 2.8,
                    slidesToScroll: 1,
                },
            },
            {
                breakpoint: 650,
                settings: {
                    arrows: false,
                    slidesToShow: 2.6,
                    slidesToScroll: 1,
                },
            },
            {
                breakpoint: 600,
                settings: {
                    arrows: false,
                    slidesToShow: 2.4,
                    slidesToScroll: 1,
                },
            },
            {
                breakpoint: 550,
                settings: {
                    arrows: false,
                    slidesToShow: 2.2,
                    slidesToScroll: 1,
                },
            },
            {
                breakpoint: 515,
                settings: {
                    arrows: false,
                    slidesToShow: 2.1,
                    slidesToScroll: 1,
                },
            },
            {
                breakpoint: 490,
                settings: {
                    arrows: false,
                    slidesToShow: 2,
                    slidesToScroll: 1,
                },
            },
            {
                breakpoint: 470,
                settings: {
                    arrows: false,
                    slidesToShow: 1.9,
                    slidesToScroll: 1,
                },
            },
            {
                breakpoint: 445,
                settings: {
                    arrows: false,
                    slidesToShow: 1.8,
                    slidesToScroll: 1,
                },
            },
            {
                breakpoint: 422,
                settings: {
                    arrows: false,
                    slidesToShow: 1.7,
                    slidesToScroll: 1,
                },
            },
            {
                breakpoint: 398,
                settings: {
                    arrows: false,
                    slidesToShow: 1.6,
                    slidesToScroll: 1,
                },
            },
            {
                breakpoint: 376,
                settings: {
                    arrows: false,
                    slidesToShow: 1.5,
                    slidesToScroll: 1,
                },
            },
            {
                breakpoint: 356,
                settings: {
                    arrows: false,
                    slidesToShow: 1.4,
                    slidesToScroll: 1,
                },
            },
            {
                breakpoint: 332,
                settings: {
                    arrows: false,
                    slidesToShow: 1.3,
                    slidesToScroll: 1,
                },
            },
        ],
    };

    // addSlide() {
    //   this.slides.push({img: "http://placehold.it/350x150/777777"})
    // }

    removeSlide() {
        this.slides.length = this.slides.length - 1;
    }

    slickInit(e: any) {
        console.log("slick initialized");
    }

    breakpoint(e: any) {
        console.log("breakpoint");
    }

    afterChange(e: any) {
        console.log("afterChange");
    }

    beforeChange(e: any) {
        console.log("beforeChange");
    }

    protected readonly JSON = JSON;
}
