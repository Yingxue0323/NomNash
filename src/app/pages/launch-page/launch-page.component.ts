import { Component } from '@angular/core';
import { Router, RouterLink } from '@angular/router';

@Component({
  selector: 'app-launch-page',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './launch-page.component.html',
  styleUrl: './launch-page.component.scss'
})
export class LaunchPageComponent {

  login() {
    try {
      window.location.href = 'https://localhost:3000/api/v1/auth/login';
    } catch (e) {
      console.error(e);
    }
  }
}
