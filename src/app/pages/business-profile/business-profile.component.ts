import { Component } from '@angular/core';
import { Location } from '@angular/common';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { StarRatingComponent } from 'src/app/components/star-rating/star-rating.component';

interface BusinessProfile {
  name: string;
  email: string;
  role: string;
  password: string;
}

@Component({
  selector: 'app-business-profile',
  standalone: true,
  imports: [CommonModule, FormsModule, StarRatingComponent],
  templateUrl: './business-profile.component.html',
  styleUrls: ['./business-profile.component.scss']
})
export class BusinessProfileComponent {
  isEditing = false;
  profile: BusinessProfile = {
    name: 'John Doe',
    email: 'johndoe@business.monash.edu',
    role: 'Business',
    password: '********'
  };

  favouriteRestaurants = [
    'Restaurant 1',
    'Restaurant 2',
    'Restaurant 3',
    'Restaurant 4'
  ];

  pastReviews = [
    { restaurantName: 'Peri Peri Chicken', rating: 4, text: 'Chicken!' },
    { restaurantName: 'Guzman Y Gomez',    rating: 5, text: 'Mexican Dishes!' },
    { restaurantName: 'Peri Peri Chicken', rating: 4, text: 'Chicken!' },
    { restaurantName: 'Guzman Y Gomez',    rating: 5, text: 'Mexican Dishes!' },
  ];

  businessList = [
    { name: 'Business 1' },
    { name: 'Business 2' },
    { name: 'Business 3' }
  ];

  businessTotalPages = 1;
  reviewTotalPages   = 1;

  constructor(private location: Location) {}

  goBack() { this.location.back(); }
  toggleEdit() { this.isEditing = !this.isEditing; }
  saveChanges() {
    this.isEditing = false;
    console.log('Profile updated:', this.profile);
  }
}
