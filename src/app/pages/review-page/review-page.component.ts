import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { StarRatingComponent } from 'src/app/components/star-rating/star-rating.component';
import { Restaurant } from 'src/app/models/restaurant.model';
import { formatPriceRange, formatTime, Category, Campus } from 'src/app/utils/constants';

interface Review {
  name: string;
  meta: string;
  rating: number;
  text: string;
  createdAt: Date;
  images?: string[];
}

interface ApiResponse<T> {
  code: number;
  message: string;
  data: T;
}

interface ReviewImage {
  file: File;
  preview: string;
}

interface UserInfo {
  id?: string;
  name: string;
  avatarUrl: string;
  role: string;
  email: string;
}

@Component({
  selector: 'app-review-page',
  standalone: true,
  imports: [CommonModule, FormsModule, StarRatingComponent],
  templateUrl: './review-page.component.html',
  styleUrls: ['./review-page.component.scss']
})
export class ReviewPageComponent implements OnInit, OnDestroy {
  // Restaurant details
  restaurant: Partial<Restaurant> = {};
  restaurantId: string = '';
  loading: boolean = true;
  error: string | null = null;
  
  // UI helper properties
  formattedPriceRange: string = '';
  cuisineType: string = '';
  address: string = '';
  openHours: string = '';

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
  reviewImages: ReviewImage[] = [];
  showAuthModal = false;
  isSubmitting = false;
  showSuccessMessage = false;
  errorMessage: string | null = null;

  // 添加登录状态监听变量
  private loginStatusInterval: any = null;
  private loginStatusListener: any = null;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private http: HttpClient
  ) {}

  ngOnInit(): void {
    // 定期检查登录状态变化
    this.startLoginStatusCheck();
    
    this.route.params.subscribe(params => {
      console.log('Route params:', params);
      if (params['id']) {
        this.restaurantId = params['id'];
        console.log('Restaurant ID from route:', this.restaurantId);
        this.fetchRestaurantDetails();
      } else {
        this.error = 'No restaurant ID provided';
        this.loading = false;
      }
    });
  }
  
  ngOnDestroy(): void {
    // 清理定时器和事件监听
    this.stopLoginStatusCheck();
  }
  
  /**
   * 启动登录状态检查
   */
  startLoginStatusCheck(): void {
    // 检查localStorage中的登录状态
    this.checkUserLoginStatus();
    
    // 设置间隔检查（每2秒检查一次是否有登录状态变化）
    this.loginStatusInterval = setInterval(() => {
      this.checkUserLoginStatus();
    }, 2000);
    
    // 监听localStorage变化事件
    window.addEventListener('storage', this.handleStorageChange.bind(this));
    
    // 监听全局登录状态变化事件
    this.loginStatusListener = this.handleLoginStatusChange.bind(this);
    document.addEventListener('login-status-changed', this.loginStatusListener);
  }
  
  /**
   * 停止登录状态检查
   */
  stopLoginStatusCheck(): void {
    if (this.loginStatusInterval) {
      clearInterval(this.loginStatusInterval);
      this.loginStatusInterval = null;
    }
    
    window.removeEventListener('storage', this.handleStorageChange.bind(this));
    
    if (this.loginStatusListener) {
      document.removeEventListener('login-status-changed', this.loginStatusListener);
      this.loginStatusListener = null;
    }
  }
  
  /**
   * 处理全局登录状态变化事件
   */
  handleLoginStatusChange(event: CustomEvent): void {
    console.log('Received login status changed event:', event.detail);
    if (event.detail && typeof event.detail.isLoggedIn !== 'undefined') {
      const isLoggedIn = event.detail.isLoggedIn;
      console.log('Login status updated:', isLoggedIn);
      
      // 立即更新界面显示
      this.checkUserLoginStatus();
    }
  }
  
  /**
   * 处理localStorage变化事件
   */
  handleStorageChange(event: StorageEvent): void {
    if (event.key === 'currentUser' || event.key === 'login_changed' || event.key === 'login_status') {
      console.log('Login status changed in localStorage, updating UI');
      this.checkUserLoginStatus();
    }
  }
  
  /**
   * 检查用户登录状态
   */
  checkUserLoginStatus(): void {
    // 这个方法只是为了确保我们有最新的登录状态
    // 实际的登录检查逻辑在 isUserLoggedIn() 和 getCurrentUser() 中
    const isLoggedIn = this.isUserLoggedIn();
    console.log('Current login status in review page:', isLoggedIn);
  }

  fetchRestaurantDetails(): void {
    this.loading = true;
    this.error = null;
    
    console.log(`Fetching restaurant details for ID: ${this.restaurantId}`);
    
    // Use the correct URL for your API
    const url = `/api/v1/restaurants/${this.restaurantId}`;
    console.log('Request URL:', url);

    this.http.get<any>(url).subscribe({
      next: (response) => {
        console.log('API response received:', response);
        
        // Handle both direct data and wrapped response formats
        let restaurantData: any;
        
        if (response && response.code === 2000 && response.data) {
          // Wrapped response format with code, message, data
          console.log('Response has wrapped format');
          restaurantData = response.data;
        } else if (response && response.name) {
          // Direct restaurant data
          console.log('Response has direct data format');
          restaurantData = response;
        } else {
          console.error('Unexpected response format:', response);
          this.error = 'Received an invalid response format from the server';
          this.loading = false;
          return;
        }
        
        this.restaurant = restaurantData;
        console.log('Processed restaurant data:', this.restaurant);
        this.processRestaurantData();
        this.loading = false;
      },
      error: (err) => {
        console.error('Error fetching restaurant details:', err);
        this.error = `Failed to load restaurant details: ${err.message || 'Unknown error'}`;
        this.loading = false;
        
        // Use mock data for development
        if (err.status === 0) {
          console.log('Using mock data for development');
          this.useMockData();
        }
      }
    });
  }

  processRestaurantData(): void {
    console.log('Processing restaurant data:', this.restaurant);
    if (this.restaurant) {
      // Format price range
      this.formattedPriceRange = formatPriceRange(this.restaurant.priceRange || []);
      
      // Set cuisine type and location
      this.cuisineType = this.restaurant.category || '';
      this.address = this.restaurant.address || '';
      
      // Format open hours if available
      if (this.restaurant.openTime && this.restaurant.openTime.length > 0) {
        const firstOpenTime = this.restaurant.openTime[0];
        this.openHours = `${firstOpenTime.dayOfWeek}: ${formatTime(firstOpenTime.openTime)} - ${formatTime(firstOpenTime.closeTime)}`;
      }
      
      // Set rating
      if (this.restaurant.rating) {
        this.averageRating = this.restaurant.rating;
      }
      
      console.log('Processed data:', {
        priceRange: this.formattedPriceRange,
        cuisine: this.cuisineType,
        address: this.address,
        openHours: this.openHours,
        rating: this.averageRating
      });
    }
  }

  useMockData(): void {
    this.restaurant = {
      name: 'Peri Peri Chicken',
      description: 'Delicious flame-grilled chicken, located on Monash Campus.',
      category: Category.AMERICAN,
      campus: Campus.MANHATTAN,
      address: 'Monash University Clayton Campus, 21 Chancellors Walk, Clayton VIC 3800',
      priceRange: [10, 20],
      rating: 4.2
    };
    this.processRestaurantData();
    this.loading = false;
  }

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
  
  /**
   * Handle image selection for review
   */
  onImageSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0 && this.reviewImages.length < 3) {
      const file = input.files[0];
      
      // Validate file is an image
      if (!file.type.startsWith('image/')) {
        alert('Please select an image file.');
        return;
      }
      
      // Create a preview
      const reader = new FileReader();
      reader.onload = (e) => {
        this.reviewImages.push({
          file,
          preview: e.target?.result as string
        });
      };
      reader.readAsDataURL(file);
      
      // Clear the input
      input.value = '';
    }
  }
  
  /**
   * Remove an image from the selected images
   */
  removeImage(index: number): void {
    this.reviewImages.splice(index, 1);
  }
  
  /**
   * Check if user is logged in
   */
  isUserLoggedIn(): boolean {
    const userJson = localStorage.getItem('currentUser');
    return userJson !== null;
  }
  
  /**
   * Get current user info
   */
  getCurrentUser(): UserInfo | null {
    const userJson = localStorage.getItem('currentUser');
    if (userJson) {
      try {
        return JSON.parse(userJson) as UserInfo;
      } catch (e) {
        console.error('Error parsing user data:', e);
        localStorage.removeItem('currentUser');
        return null;
      }
    }
    return null;
  }
  
  /**
   * Open authentication modal
   */
  openAuthModal(): void {
    // Redirect to auth modal in header
    this.showAuthModal = true;
    
    console.log('Triggering auth modal from review page');
    
    // 使用document级别事件以确保事件能被header组件捕获
    document.dispatchEvent(
      new CustomEvent('open-auth-modal', { 
        bubbles: true,
        composed: true  // 允许事件穿越Shadow DOM边界
      })
    );
    
    // 备用方案：如果事件无效，则导航到主页
    setTimeout(() => {
      if (!document.querySelector('.fixed.inset-0')) {  // 检查模态框是否已显示
        console.log('Auth modal not shown, navigating to home page');
        this.router.navigate(['/']);
      }
    }, 300);
  }

  /** Adds a new review to the top of the list */
  postReview() {
    const text = this.newReview.trim();
    if (!text) return;
    
    // Check if user is logged in
    if (!this.isUserLoggedIn()) {
      this.openAuthModal();
      return;
    }
    
    // Get user info
    const user = this.getCurrentUser();
    if (!user) {
      console.error('Failed to get user info');
      return;
    }
    
    // Show loading state
    this.isSubmitting = true;
    
    // First, upload images if any
    const uploadPromises: Promise<string>[] = [];
    
    if (this.reviewImages.length > 0) {
      this.reviewImages.forEach(img => {
        // Create FormData for image upload
        const formData = new FormData();
        formData.append('image', img.file);
        
        // Create a promise for each image upload
        const uploadPromise = new Promise<string>((resolve, reject) => {
          // In a real app, this would be a call to upload the image to your server or cloud storage
          // For example: this.http.post<any>('/api/v1/upload', formData)
          
          // For demonstration, we'll just resolve with the data URL
          // In production, replace this with actual image upload
          setTimeout(() => {
            resolve(img.preview);
          }, 500);
        });
        
        uploadPromises.push(uploadPromise);
      });
    }
    
    // After all images are uploaded, create and send the review
    Promise.all(uploadPromises)
      .then(imageUrls => {
        // Create review object matching the backend model
        const reviewData = {
          rating: this.newRating,
          text: text,
          imagesUrl: imageUrls.length > 0 ? imageUrls : []
        };
        
        console.log('Sending review:', reviewData);
        
        // Send review to backend with correct API endpoint
        this.http.post<ApiResponse<any>>(
          `/api/v1/reviews/restaurant/${this.restaurantId}`, 
          reviewData, 
          { withCredentials: true }
        ).subscribe({
            next: (response) => {
              console.log('Review posted successfully:', response);
              
              // Add the review to the local list
              this.reviews.unshift({
                name: user.name,
                meta: 'Just now',
                rating: this.newRating,
                text,
                createdAt: new Date(),
                images: imageUrls
              });
              
              // Reset the form
              this.newReview = '';
              this.newRating = 5;
              this.reviewImages = [];
              this.totalReviews++;
              this.isSubmitting = false;
              
              // Optionally show success message
              this.showSuccessMessage = true;
              setTimeout(() => {
                this.showSuccessMessage = false;
              }, 3000);
            },
            error: (err) => {
              console.error('Error posting review:', err);
              this.isSubmitting = false;
              
              // Optionally show error message
              this.errorMessage = 'Failed to post review. Please try again.';
              setTimeout(() => {
                this.errorMessage = null;
              }, 3000);
              
              // For development: add review to local list even if backend fails
              if (err.status === 0) {
                this.reviews.unshift({
                  name: user.name,
                  meta: 'Just now (local only)',
                  rating: this.newRating,
                  text,
                  createdAt: new Date(),
                  images: imageUrls
                });
                
                // Reset the form
                this.newReview = '';
                this.newRating = 5;
                this.reviewImages = [];
                this.totalReviews++;
              }
            }
          });
      })
      .catch(err => {
        console.error('Error uploading images:', err);
        this.isSubmitting = false;
        this.errorMessage = 'Failed to upload images. Please try again.';
      });
  }
}
