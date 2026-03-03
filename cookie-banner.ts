import { CommonModule } from '@angular/common';
import { Component, OnInit, signal } from '@angular/core';

@Component({
  selector: 'app-cookie-banner',
  imports: [CommonModule],
  templateUrl: './cookie-banner.html',
  styleUrl: './cookie-banner.scss',
})
export class CookieBanner {
  isVisible = signal(false);

  ngOnInit() {
    // Ellenőrizzük, hogy elfogadta-e már korábban
    const consent = localStorage.getItem('cookieConsent');
    if (!consent) {
      // Egy kis késleltetéssel jelenítjük meg a hatás kedvéért
      setTimeout(() => this.isVisible.set(true), 1500);
    }
  }

  acceptCookies() {
    localStorage.setItem('cookieConsent', 'true');
    this.isVisible.set(false);
  }

}
