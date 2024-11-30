import {Component} from '@angular/core';
import {NgOptimizedImage} from "@angular/common";
import {RouterLink} from "@angular/router";

@Component({
    selector: 'app-news',
    standalone: true,
    imports: [
        NgOptimizedImage,
        RouterLink
    ],
    templateUrl: './news.component.html',
    styleUrl: './news.component.scss'
})
export class NewsComponent {

    news = [
        {
            imgSrc: '/assets/svg/newsImg.png',
            title: 'Free games to play this weekend (23-24 March) - ' +
                'a comprehensive round-up Humble the best of boomer shooters Game bundle is here!  the best of boomer shooters Game bundle  he best of boomer shooters Game bund',
            added: '4h ago',
            subTitle: 'Are there any freebies to snag this weekend? You bet there are!',
            platforms: ['windows', 'playstation'],
            route: 'counter-strike-2.0'
        },
        {
            imgSrc: '/assets/svg/newsImg.png',
            title: 'Free games to play the!',
            added: '4h ago',
            subTitle: 'Are there t there are!',
            platforms: ['windows', 'playstation'],
            route: 'counter-strike-3.0'

        },
        {
            imgSrc: '/assets/svg/newsImg.png',
            title: 'Free games to play this weekend (23-24 March) - a comprehensive round-up Humble the best of boomer shooters Game bundle is here!',
            added: '4h ago',
            subTitle: 'Are there any freebies to snag this weekend? You bet there are!',
            platforms: ['playstation'],
            route: 'counter-strike-4.0'

        },
    ]

}
