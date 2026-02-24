import { Component, AfterViewInit, ElementRef, Renderer2, ViewChildren, QueryList } from '@angular/core';

@Component({
  selector: 'app-how-it-works',
  imports: [],
  templateUrl: './how-it-works.html',
  styleUrl: './how-it-works.scss',
})
export class HowItWorks implements AfterViewInit{
constructor(
    private renderer: Renderer2, 
    private el: ElementRef
  ) {}

  ngAfterViewInit() {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        this.renderer.addClass(entry.target, 'animate');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.3 });

  // A nyilakat keressük meg
  const arrows = this.el.nativeElement.querySelectorAll('.curved-arrow');
  arrows.forEach((arrow: HTMLElement) => observer.observe(arrow));
}

}
