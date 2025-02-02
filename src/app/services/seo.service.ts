import { Injectable, Inject, PLATFORM_ID } from '@angular/core';
import { Meta, Title } from '@angular/platform-browser';
import { isPlatformBrowser } from '@angular/common';

@Injectable({
  providedIn: 'root'
})
export class SeoService {
  constructor(
      private meta: Meta,
      private titleService: Title,
      @Inject(PLATFORM_ID) private platformId: object
  ) {}

  setCanonicalURL(url: string): void {
    if (!url) return;

    if (isPlatformBrowser(this.platformId)) {
      // ბრაუზერში დინამიურად დაამატებს canonical-ს
      let link: HTMLLinkElement | null = document.querySelector("link[rel='canonical']");
      if (link) {
        link.setAttribute('href', url);
      } else {
        link = document.createElement('link');
        link.setAttribute('rel', 'canonical');
        link.setAttribute('href', url);
        document.head.appendChild(link);
      }
    } else {
      // სერვერზე დაამატებს canonical meta-ს, რომ იგი ფეიჯ სორსშიც იყოს
      this.meta.updateTag({ rel: 'canonical', href: url });
    }
  }

  setTitle(title: string): void {
    this.titleService.setTitle(title);
  }
}
