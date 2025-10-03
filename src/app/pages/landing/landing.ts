import { Component } from '@angular/core';

//layout
import { Header } from '../../layout/header/header';
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
    Header,
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
export class Landing {

}
