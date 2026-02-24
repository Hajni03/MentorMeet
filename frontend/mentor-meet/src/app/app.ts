import { Component, signal, inject } from '@angular/core';
import { RouterModule, RouterOutlet } from '@angular/router';
import { Header } from './shared/header/header';
import { Footer } from './shared/footer/footer';
import { ModuleModule } from './module/module-module';
import { Router, NavigationEnd } from '@angular/router';
import { filter } from 'rxjs';
import { CommonModule } from '@angular/common';
import { AuthService } from './shared/services/auth.service';
import { Navbar } from './core/navbar/navbar';


@Component({
  selector: 'app-root',
  imports: [RouterOutlet, Header, Footer, ModuleModule, RouterModule, CommonModule, Navbar],
  templateUrl: './app.html',
  styleUrl: './app.scss'
})
export class App {
  authService = inject(AuthService);
  protected readonly title = signal('mentor-meet');
  // Új Signal, ami vezérli a láthatóságot
  showPublicElements = signal(true); 
  
  private router = inject(Router);

  constructor() {
    // Figyeljük, merre jár a felhasználó
    this.router.events.pipe(
      filter(event => event instanceof NavigationEnd)
    ).subscribe((event: any) => {
      // Ha az URL-ben benne van a 'dashboard', hamisra állítjuk
      const isDashboard = event.url.includes('/dashboard');
      this.showPublicElements.set(!isDashboard);
    });
  }
}
