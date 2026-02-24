import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';

@Component({
  selector: 'app-stats',
  imports: [CommonModule],
  templateUrl: './stats.html',
  styleUrl: './stats.scss',
})
export class Stats {

 stats = [
    { target: 1000, current: 0, label: 'sikeres konzultáció', suffix: '+' },
    { target: 200, current: 0, label: 'aktív tanár', suffix: '+' },
    { target: 1500, current: 0, label: 'regisztrált diák', suffix: '+' }
  ];

  ngOnInit() {
    this.setupIntersectionObserver();
  }

  setupIntersectionObserver() {
    const observer = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting) {
        this.animateNumbers();
        observer.disconnect(); // Csak egyszer pörögjön le
      }
    }, { threshold: 0.2 });

    const target = document.querySelector('.reviews-section');
    if (target) observer.observe(target);
  }

  animateNumbers() {
    const duration = 2000; 
    const startTime = performance.now();

    const update = (now: number) => {
      const elapsed = now - startTime;
      const progress = Math.min(elapsed / duration, 1);
      // Ease-out mozgás (elején gyors, a végén lassul)
      const easeProgress = 1 - Math.pow(1 - progress, 3);

      this.stats.forEach(stat => {
        stat.current = Math.floor(easeProgress * stat.target);
      });

      if (progress < 1) {
        requestAnimationFrame(update);
      }
    };
    requestAnimationFrame(update);
  }

}
