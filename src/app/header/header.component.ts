import { Component, ElementRef, HostListener, Inject, PLATFORM_ID, Renderer2 } from '@angular/core';
import {CommonModule, isPlatformBrowser, NgOptimizedImage} from "@angular/common";
import {SearchComponent} from "../shared/search/search.component";
import {RouterLink, RouterLinkActive} from "@angular/router";

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [
    NgOptimizedImage,
    CommonModule,
    SearchComponent,
    RouterLink,
    RouterLinkActive
  ],
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss'
})
export class HeaderComponent {
  isMenuOpen: boolean = false;
  mobileSize: boolean;

  constructor(
    @Inject(PLATFORM_ID) private platformId: Object,
  ) {
    this.mobileSize = isPlatformBrowser(this.platformId) ? window.innerWidth <= 768 : false;
  }

  toggleMenu(): void {
    this.isMenuOpen = !this.isMenuOpen;
  }

  @HostListener('window:resize', ['$event'])
  onResize(): void {
    if (isPlatformBrowser(this.platformId)) {
      this.mobileSize = window.innerWidth <= 768;
      if (!this.mobileSize) {
        this.isMenuOpen = false;
      }
    }
  }
}
