import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { User } from 'src/app/models/user';
import { HttpClientModule } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-sign-up-page',
  standalone: true,
  imports: [FormsModule, HttpClientModule, CommonModule, RouterModule],
  templateUrl: './sign-up-page.component.html',
  styleUrl: './sign-up-page.component.scss'
})
export class SignUpPageComponent {

  user: User = new User();
  
  private apiUrl = 'http://localhost:3000/api/v1/auth';

  constructor(private http: HttpClient, private router: Router) {}

  addUser() {
    this.http.post(`${this.apiUrl}/signup`, this.user).subscribe((response) => {
      this.router.navigate(['/login']);
    });
  }

  loginWithGoogle() {
    window.location.href = `${this.apiUrl}/login`;
  }
}
