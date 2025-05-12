import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { DatabaseService } from 'src/app/database.service';
import { User } from 'src/app/models/user';

@Component({
  selector: 'app-sign-up-page',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './sign-up-page.component.html',
  styleUrl: './sign-up-page.component.scss'
})
export class SignUpPageComponent {

  // user: User = new User();

  // constructor(private db: DatabaseService, private router: Router) {}

  // addUser() {
  //   this.db.addUser(this.user).subscribe((response) => {
  //     this.router.navigate(['/login']);
  //   });
  // }
}
