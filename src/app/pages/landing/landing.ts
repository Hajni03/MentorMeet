import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';

//layout
import { HeaderComponent } from '../../layout/header/header';
import { Footer } from '../../layout/footer/footer';

//sections
import { Hero } from '../../sections/hero/hero';
import { BrandStrip } from '../../sections/brand-strip/brand-strip';
import { Features } from '../../sections/features/features';
import { TestimonialsStrip } from '../../sections/testimonials-strip/testimonials-strip';
import { HowItWorks } from '../../sections/how-it-works/how-it-works';
import { Cta } from '../../sections/cta/cta';

@Component({
  selector: 'app-landing',
  standalone: true,
  imports: [
    HeaderComponent,
    Hero,
    BrandStrip,
    Features,
    TestimonialsStrip,
    HowItWorks,
    Cta,
    Footer
  ],
  templateUrl: './landing.html',
  styleUrl: './landing.scss'
})
export class Landing{

}