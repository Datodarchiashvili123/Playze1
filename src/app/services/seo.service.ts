import { Injectable, Inject } from '@angular/core';
import { DOCUMENT } from '@angular/common';

@Injectable({
  providedIn: 'root'
})
export class SeoService {
  constructor(@Inject(DOCUMENT) private document: Document) {}

  /**
   * დაყენებს ან განაახლებს კანონიკალ ლინკს სათაური გვერდისთვის.
   * @param url - ბეჭდვის URL. თუ არ არის მითითებული, გამოიყენება window.location.href (ბრაუზერზე).
   */
  setCanonicalURL(url?: string): void {
    // დინამიურად ავიღოთ URL თუ პარამეტრი არ არის მითითებული
    const canonicalURL = url || this.document.location.href;

    // მოძებნეთ უკვე არსებობს კანონიკალ ლინკი
    let link: HTMLLinkElement | null = this.document.querySelector("link[rel='canonical']");

    if (link) {
      // განაახლეთ უკვე არსებული ელემენტის href ატრიბუტი
      link.setAttribute('href', canonicalURL);
    } else {
      // თუ არ არის, შეიქმნება ახალი ელემენტი
      link = this.document.createElement('link');
      link.setAttribute('rel', 'canonical');
      link.setAttribute('href', canonicalURL);
      this.document.head.appendChild(link);
    }
  }
}
