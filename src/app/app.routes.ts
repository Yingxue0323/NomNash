import { HttpClient, HttpClientModule } from '@angular/common/http';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { User } from 'src/app/models/user';

@Component({
  selector: 'app-sign-up-page',
  standalone: true,
  imports: [FormsModule, HttpClientModule],
  templateUrl: './pages/sign-up-page/sign-up-page.component.html',
  styleUrl: './pages/sign-up-page/sign-up-page.component.scss'
})

export class SignUpPageComponent {
  user: User = new User();
  
  private apiUrl = 'http://localhost:3000/api/v1/auth';

  constructor(private http: HttpClient, private router: Router) {}

  addUser() {
    this.http.post(`${this.apiUrl}/signup`, this.user).subscribe({
      next: (response) => {
        this.router.navigate(['/login']);
      },
      error: (error) => {
        console.error('signup failed:', error);
        alert('signup failed, please try again later');
      }
    });
  }

  loginWithGoogle() {
    console.log('attempting to redirect to:', `${this.apiUrl}/login`);
    try {
      window.location.href = `${this.apiUrl}/login`;
    } catch (error) {
      console.error('redirect failed:', error);
    }
  }
}