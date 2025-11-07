import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

type Step = {
  title: string;
  desc: string;
  img: string;
  alt: string;
};

@Component({
  selector: 'app-how-it-works',
  imports: [CommonModule],
  templateUrl: './how-it-works.html',
  styleUrl: './how-it-works.scss'
})
export class HowItWorks {
  steps: Step[] = [
    {
      title: 'Regisztráció',
      desc: 'Hozz létre egy fiókot pár kattintással, és lépj be a rendszerbe.',
      img: 'assets/img/icons/profile_icon.png', // vagy .svg – ikon kép ide
      alt: 'Felhasználó ikon'
    },
    {
      title: 'Tanár kiválasztása',
      desc: 'Találd meg a számodra megfelelő tanárt a listából.',
      img: 'assets/img/icons/teacher_icon.png',
      alt: 'Tanár ikon'
    },
    {
      title: 'Időpontfoglalás',
      desc: 'Válassz egy szabad időpontot, és készülj a konzultációra.',
      img: 'assets/img/icons/calendar_icon.png',
      alt: 'Naptár ikon'
    }
  ];
}
