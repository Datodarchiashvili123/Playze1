import { Injectable, Inject, PLATFORM_ID } from '@angular/core';
import { DOCUMENT } from '@angular/common';
import { isPlatformBrowser, isPlatformServer } from '@angular/common';

@Injectable({
  providedIn: 'root'
})
export class SeoService {
  constructor(
      @Inject(DOCUMENT) private document: Document,
      @Inject(PLATFORM_ID) private platformId: object
  ) {}

  setCanonicalURL(url: string): void {
    if (!url) return;

    if (isPlatformServer(this.platformId)) {
      // SSR-ის დროს პირდაპირ დოკუმენტის head-ში დამატება, რომ ფეიჯ სორსშიც გამოჩნდეს
      const linkTag = this.document.createElement('link');
      linkTag.setAttribute('rel', 'canonical');
      linkTag.setAttribute('href', url);
      this.document.head.appendChild(linkTag);
    }

    if (isPlatformBrowser(this.platformId)) {
      // ბრაუზერში განახლება, თუ საჭიროა
      let link: HTMLLinkElement | null = this.document.querySelector("link[rel='canonical']");
      if (link) {
        link.setAttribute('href', url);
      } else {
        link = this.document.createElement('link');
        link.setAttribute('rel', 'canonical');
        link.setAttribute('href', url);
        this.document.head.appendChild(link);
      }
    }
  }
}
