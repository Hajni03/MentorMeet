import { Component } from '@angular/core';
import { Hero } from '../hero/hero';
import { Features } from '../features/features';
import { HowItWorks } from '../how-it-works/how-it-works';
import { Stats } from '../stats/stats';
import { Cta } from '../cta/cta';
import { Navbar } from '../../core/navbar/navbar';

@Component({
  selector: 'app-landing-page',
  imports: [Hero, Features, HowItWorks, Stats, Cta, Navbar], 
  templateUrl: './landing-page.html',
  styleUrl: './landing-page.scss',
})
export class LandingPage {

}
