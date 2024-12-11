import {Component, EventEmitter, Input, Output} from '@angular/core';
import {NgClass, NgOptimizedImage} from "@angular/common";

@Component({
    selector: 'app-tag',
    imports: [
        NgOptimizedImage,
        NgClass
    ],
    templateUrl: './tag.component.html',
    styleUrl: './tag.component.scss'
})
export class TagComponent {

    @Input() isActive: boolean = false;
    @Input() text: string = '';
    @Input() value: string = '';

    @Output() tagClicked = new EventEmitter<string>(); // Event emitter to notify when tag is clicked

    onTagClick() {
        this.tagClicked.emit(this.value); // Emit the text of the clicked tag
    }

}
