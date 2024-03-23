import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import {NgOptimizedImage} from "@angular/common";

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, NgOptimizedImage],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  image: string = '/assets/img/Rectangle.svg'; // Path to your image
  fb='https://www.facebook.com/playze.io';
  X = 'https://twitter.com/playze_io';
  instagram='https://www.instagram.com/playze.io/';
  // Create an array with 10 copies of the same image path
  images: string[] = Array(22).fill(this.image);
}
