import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Header } from './shared/header/header';
import { Footer } from './shared/footer/footer';
import { ModuleModule } from './module/module-module';
import { Navbar } from './core/navbar/navbar';


@Component({
  selector: 'app-root',
  imports: [RouterOutlet, Header, Footer, ModuleModule, Navbar ],
  templateUrl: './app.html',
  styleUrl: './app.scss'
})
export class App {
  protected readonly title = signal('mentor-meet');
}
