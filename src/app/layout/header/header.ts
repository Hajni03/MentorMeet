import { Component } from '@angular/core';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';


@Component({
  selector: 'app-header',
  standalone: true,
  imports: [RouterLink, RouterLinkActive],
  templateUrl: './header.html',
  styleUrls: ['./header.scss']
})
export class HeaderComponent {

  constructor(private router: Router) {}

  goToLogin(): void {
    this.router.navigate([]);
  }  

  goToRegister(): void {
    this.router.navigate(['src/app/pages/register/register.html']);
  }

}
