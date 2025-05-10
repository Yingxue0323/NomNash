import { Component } from '@angular/core';
import { Location } from '@angular/common';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { StarRatingComponent } from 'src/app/components/star-rating/star-rating.component';

interface StudentProfile {
  name: string;
  email: string;
  role: string;
  password: string;
}

@Component({
  selector: 'app-student-profile',
  standalone: true,
  imports: [CommonModule, FormsModule, StarRatingComponent],
  templateUrl: './student-profile.component.html',
  styleUrls: ['./student-profile.component.scss']
})
export class StudentProfileComponent {
  isEditing = false;
  profile: StudentProfile = {
    name: 'John Doe',
    email: 'johndoe@student.monash.edu',
    role: 'Student',
    password: '********'
  };

  favouriteRestaurants = [
    'Restaurant Name 1',
    'Restaurant Name 2',
    'Restaurant Name 3',
    'Restaurant Name 4'
  ];
  pastReviews = [
    { restaurantName: 'Review 1', rating: 0, text: '' },
    { restaurantName: 'Review 2', rating: 0, text: '' },
    { restaurantName: 'Review 3', rating: 0, text: '' }
  ];

  favTotalPages = 1;
  reviewTotalPages = 1;

  constructor(private location: Location) {}

  goBack() { this.location.back(); }
  toggleEdit() { this.isEditing = !this.isEditing; }
  saveChanges() {
    this.isEditing = false;
    console.log('Profile updated:', this.profile);
  }
}
