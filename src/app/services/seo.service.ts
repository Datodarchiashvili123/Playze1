import { Injectable, Inject, PLATFORM_ID } from '@angular/core';
import { DOCUMENT } from '@angular/common';
import { isPlatformBrowser } from '@angular/common';

@Injectable({
  providedIn: 'root'
})
export class SeoService {
  constructor(@Inject(DOCUMENT) private document: Document, @Inject(PLATFORM_ID) private platformId: object) {}

  setCanonicalURL(url?: string): void {
    // მხოლოდ მაშინ ვაწვდით canonical URL-ს, თუ კოდი ბრაუზერში მუშაობს
    if (isPlatformBrowser(this.platformId)) {
      const canonicalURL = url || this.document.location.href;

      let link: HTMLLinkElement | null = this.document.querySelector("link[rel='canonical']");
      if (link) {
        link.setAttribute('href', canonicalURL);
      } else {
        link = this.document.createElement('link');
        link.setAttribute('rel', 'canonical');
        link.setAttribute('href', canonicalURL);
        this.document.head.appendChild(link);
      }
    }
  }
}
