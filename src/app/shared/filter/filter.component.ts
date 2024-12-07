import {Component, EventEmitter, Input, Output} from '@angular/core';
import {NgStyle} from "@angular/common";
import {ClickOutsideDirective} from "../../directives/click-outside.directive";

@Component({
    selector: 'app-filter',
    imports: [
        ClickOutsideDirective,
        NgStyle
    ],
    templateUrl: './filter.component.html',
    styleUrl: './filter.component.scss'
})
export class FilterComponent {
    toggleStates: boolean[] = []; // Array to store the state of each checkbox
    openClose = false;
    @Input() last = false;
    @Input() text = 'Price';
    @Input() idKey = 'genreId'; // Add this input to accept the correct ID key
    @Input() items = [{
        genreId: 1,
        name: 'Price',
    }];

    @Output() filterChanged = new EventEmitter<any>();
    selectedItems: number[] = []; // Stores the IDs of selected items.


    constructor() {
        // Initialize the toggle states array with false values for each checkbox
        this.toggleStates = Array(3).fill(false); // Change '3' to the number of checkboxes you have
    }

    toggleFilters(index: number) {
        // Toggle the state of the checkbox at the specified index.
        this.toggleStates[index] = !this.toggleStates[index];
        const selectedId = (this.items[index] as any)[this.idKey]; // Cast the item to 'any' to allow dynamic indexing
        if (this.toggleStates[index]) {
            this.selectedItems.push(selectedId); // Add to selected items if checked.
        } else {
            this.selectedItems = this.selectedItems.filter(id => id !== selectedId); // Remove from selected items if unchecked.
        }

        this.filterChanged.emit(this.selectedItems); // Emit the array of selected IDs.
    }


    openCloseDropdown() {
        this.openClose = !this.openClose;
    }

    closeDropdown() {
        this.openClose = false;
    }
}
