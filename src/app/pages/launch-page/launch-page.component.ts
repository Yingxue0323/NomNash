import { Component } from '@angular/core';

@Component({
  selector: 'app-launch-page',
  standalone: true,
  imports: [],
  templateUrl: './launch-page.component.html',
  styleUrl: './launch-page.component.scss'
})
export class LaunchPageComponent {

  login() {
    window.location.href = 'https://localhost:8000/api/v1/auth/login';
  }
}
