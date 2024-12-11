import {Component, Input} from '@angular/core';
import {NgOptimizedImage} from "@angular/common";

@Component({
    selector: 'app-deals-card',
    imports: [
        NgOptimizedImage
    ],
    templateUrl: './deals-card.component.html',
    styleUrl: './deals-card.component.scss'
})
export class DealsCardComponent {

    @Input() src: string | undefined;
    @Input() name: string | undefined;
    @Input() discount: string | undefined;
    @Input() price: string | undefined;

}
