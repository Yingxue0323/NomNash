import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { StarRatingComponent } from 'src/app/components/star-rating/star-rating.component';

interface Review {
  name: string;
  meta: string;
  rating: number;
  text: string;
  createdAt: Date;
}

@Component({
  selector: 'app-review-page',
  standalone: true,
  imports: [CommonModule, FormsModule, StarRatingComponent],
  templateUrl: './review-page.component.html',
  styleUrls: ['./review-page.component.scss']
})
export class ReviewPageComponent {
  // Restaurant details
  restaurant = {
    name: 'Peri Peri Chicken',
    description: 'Delicious flame-grilled chicken, located on Monash Campus.'
  };

  // Rating summary
  averageRating = 4.0;
  totalReviews = 953;
  ratingDistribution = [100, 60, 30, 10, 45]; // percentages for stars 5→1

  // Sorting controls
  sortOptions = ['Most relevant', 'Newest', 'Highest', 'Lowest'];
  sortBy = this.sortOptions[0];

  // Existing reviews
  reviews: Review[] = [
    {
      name: 'Yash Saksena',
      meta: '3 reviews · 1 photo · a week ago',
      rating: 4,
      text: 'They gave me free ice-cream for a review. But to be honest, the food here is as expected and it\'s the only place on Monash…',
      createdAt: new Date('2025-05-03T10:00:00')
    },
    {
      name: 'Alice Wu',
      meta: '1 review · 2 weeks ago',
      rating: 5,
      text: 'Amazing service and flavors!',
      createdAt: new Date('2025-04-25T15:30:00')
    },
    {
      name: 'Bob Lee',
      meta: '2 reviews · 3 days ago',
      rating: 2,
      text: 'Too salty for my taste.',
      createdAt: new Date('2025-05-07T09:45:00')
    }
  ];

  // New review form model
  newReview = '';
  newRating = 5;

  /** Returns reviews sorted by the current sortBy */
  get sortedReviews(): Review[] {
    const arr = [...this.reviews];
    switch (this.sortBy) {
      case 'Newest':
        return arr.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
      case 'Highest':
        return arr.sort((a, b) => b.rating - a.rating);
      case 'Lowest':
        return arr.sort((a, b) => a.rating - b.rating);
      default:
        // Most relevant (original order)
        return arr;
    }
  }

  /** Adds a new review to the top of the list */
  postReview() {
    const text = this.newReview.trim();
    if (!text) return;

    this.reviews.unshift({
      name: 'You',
      meta: 'Just now',
      rating: this.newRating,
      text,
      createdAt: new Date()
    });

    this.newReview = '';
    this.newRating = 5;
    this.totalReviews++;
  }
}
