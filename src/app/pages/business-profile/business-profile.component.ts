import { Component, OnInit } from '@angular/core';
import { Location } from '@angular/common';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { StarRatingComponent } from 'src/app/components/star-rating/star-rating.component';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';

interface BusinessProfile {
  name: string;
  email: string;
  role: string;
  avatar?: string;
  password?: string;
  googleId?: string;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface Restaurant {
  name: string;
  description?: string;
  location?: string;
  contact?: string;
  createdAt?: string;  // Add this field for sorting by newest
}

export interface Review {
  restaurantName: string;
  text: string;
  rating: number;
  date?: string;
  replied?: boolean;  // Add this field to track if a review has been replied to
  id?: string;        // Add this field to identify the review
}

@Component({
  selector: 'app-business-profile',
  standalone: true,
  imports: [CommonModule, FormsModule, StarRatingComponent],
  templateUrl: './business-profile.component.html',
  styleUrls: ['./business-profile.component.scss']
})
export class BusinessProfileComponent implements OnInit {
  isEditing = false;
  profile: BusinessProfile = {
    name: 'John Doe',
    email: 'johndoe@business.monash.edu',
    role: 'Business',
    password: '********',
    createdAt: new Date()
  };

  // 当前选中的部分：profile（个人资料）、restaurants（餐厅管理）或reviews（评论管理）
  activeSection: 'profile' | 'restaurants' | 'reviews' = 'profile';
  
  // New properties for restaurant filtering and sorting
  restaurantSearchQuery: string = '';
  restaurantSortOption: string = 'name';
  
  // New properties for review filtering
  reviewSearchQuery: string = '';
  reviewFilterOption: string = 'all';

  favouriteRestaurants = [
    'Restaurant 1',
    'Restaurant 2',
    'Restaurant 3',
    'Restaurant 4'
  ];

  pastReviews: Review[] = [
    { restaurantName: 'Peri Peri Chicken', rating: 4, text: 'Chicken!' },
    { restaurantName: 'Guzman Y Gomez',    rating: 5, text: 'Mexican Dishes!' },
    { restaurantName: 'Peri Peri Chicken', rating: 4, text: 'Chicken!' },
    { restaurantName: 'Guzman Y Gomez',    rating: 5, text: 'Mexican Dishes!' },
  ];

  businessList: Restaurant[] = [
    { name: 'Business 1' },
    { name: 'Business 2' },
    { name: 'Business 3' }
  ];

  businessTotalPages = 1;
  reviewTotalPages   = 1;
  loading = false;
  error = '';

  // 模态框状态
  showRestaurantModal = false;
  showReplyModal = false;
  editingRestaurant = false;
  currentRestaurant: Restaurant = { name: '' };
  currentReview: Review | null = null;
  replyText = '';

  defaultAvatar = '/assets/nomnash-logo.png';

  constructor(
    private location: Location,
    private router: Router,
    private http: HttpClient
  ) {}
  
  ngOnInit() {
    this.checkUserRole();
    this.fetchBusinessProfile();
  }
  
  // 检查用户角色，确保只有商家（OWNER角色）可以访问
  private checkUserRole() {
    try {
      const userString = localStorage.getItem('currentUser');
      if (!userString) {
        console.log('未登录用户，重定向至首页');
        this.router.navigate(['/']);
        return;
      }
      
      const user = JSON.parse(userString);
      if (user.role !== 'OWNER') {
        console.log('非商家用户尝试访问商家页面，重定向至合适页面');
        if (user.role === 'USER') {
          this.router.navigate(['/student']);
        } else {
          this.router.navigate(['/']);
        }
      }
    } catch (error) {
      console.error('解析用户信息出错', error);
      this.router.navigate(['/']);
    }
  }
  
  fetchBusinessProfile() {
    this.loading = true;
    this.http.get<any>('/api/v1/users/profile', { withCredentials: true })
      .subscribe({
        next: (response) => {
          console.log('Business profile data received:', response);
          
          // 处理嵌套的响应格式 - 数据在 response.data 中
          if (response.code === 2000 && response.data) {
            const userData = response.data;
            
            this.profile = {
              name: userData.name,
              email: userData.email,
              avatar: userData.avatar,
              role: userData.role,
              password: '********',
              googleId: userData.googleId,
              createdAt: userData.createdAt ? new Date(userData.createdAt) : new Date(),
              updatedAt: userData.updatedAt ? new Date(userData.updatedAt) : new Date()
            };
          } else if (response && response.name) {
            // 直接响应格式
            this.profile = {
              name: response.name,
              email: response.email,
              avatar: response.avatar,
              role: response.role,
              password: '********',
              createdAt: new Date(),
              updatedAt: new Date()
            };
          } else {
            console.error('Invalid response format:', response);
            this.error = '服务器返回了无效的数据格式';
          }
          
          this.loading = false;
        },
        error: (err) => {
          console.error('Error fetching business profile:', err);
          this.error = 'Failed to load profile. Please try again later.';
          this.loading = false;
        }
      });
  }

  // 格式化日期
  formatDate(date: Date | undefined): string {
    if (!date) return 'N/A';
    return new Date(date).toLocaleDateString();
  }

  // 处理图片加载错误
  handleImageError(event: Event) {
    const imgElement = event.target as HTMLImageElement;
    console.log('Image failed to load:', imgElement.src);
    imgElement.src = this.defaultAvatar;
  }

  goBack() {
    this.location.back();
  }

  toggleEdit() {
    this.isEditing = !this.isEditing;
  }

  saveChanges() {
    this.isEditing = false;
    console.log('Profile updated:', this.profile);
    // 这里可以添加向后端保存修改的逻辑
  }

  cancelEdit() {
    this.isEditing = false;
    this.fetchBusinessProfile(); // 重新获取数据，放弃修改
  }

  /** 移除餐厅 */
  removeBusiness(index: number): void {
    const biz = this.businessList[index];
    if (!biz) return;
    if (confirm(`Remove "${biz.name}" from your business list?`)) {
      this.businessList.splice(index, 1);
    }
  }

  // 打开添加餐厅模态框
  openAddRestaurantModal() {
    this.editingRestaurant = false;
    this.currentRestaurant = { name: '' };
    this.showRestaurantModal = true;
  }

  // 打开编辑餐厅模态框
  editRestaurant(restaurant: Restaurant) {
    this.editingRestaurant = true;
    this.currentRestaurant = { ...restaurant };
    this.showRestaurantModal = true;
  }

  // 关闭餐厅模态框
  closeRestaurantModal() {
    this.showRestaurantModal = false;
  }

  // 保存餐厅信息
  saveRestaurant() {
    if (!this.currentRestaurant.name.trim()) {
      alert('Please enter a restaurant name');
      return;
    }

    if (this.editingRestaurant) {
      // 更新现有餐厅
      const index = this.businessList.findIndex(r => r.name === this.currentRestaurant.name);
      if (index !== -1) {
        this.businessList[index] = { ...this.currentRestaurant };
      }
    } else {
      // 添加新餐厅
      this.businessList.push({ ...this.currentRestaurant });
    }

    this.closeRestaurantModal();
  }

  // 回复评论
  replyToReview(review: Review) {
    this.currentReview = review;
    this.replyText = '';
    this.showReplyModal = true;
  }

  // 关闭回复模态框
  closeReplyModal() {
    this.showReplyModal = false;
  }

  // 提交回复
  submitReply() {
    if (!this.replyText.trim()) {
      alert('Please enter a reply');
      return;
    }

    console.log('Reply submitted:', {
      reviewId: this.currentReview?.id,
      reply: this.replyText
    });
    
    // 这里可以添加向后端提交回复的逻辑
    
    this.closeReplyModal();
  }

  // 设置当前活动的部分
  setActiveSection(section: 'profile' | 'restaurants' | 'reviews') {
    this.activeSection = section;
  }

  get filteredBusinessList(): Restaurant[] {
    let filteredList = [...this.businessList];
    
    // Apply search
    if (this.restaurantSearchQuery) {
      const query = this.restaurantSearchQuery.toLowerCase();
      filteredList = filteredList.filter(restaurant => 
        restaurant.name.toLowerCase().includes(query) || 
        (restaurant.description && restaurant.description.toLowerCase().includes(query)) ||
        (restaurant.location && restaurant.location.toLowerCase().includes(query))
      );
    }
    
    // Apply sorting
    switch (this.restaurantSortOption) {
      case 'name':
        filteredList.sort((a, b) => a.name.localeCompare(b.name));
        break;
      case 'newest':
        // Sort by index as a fallback if createdAt is not available
        filteredList = [...filteredList].reverse();
        break;
      case 'location':
        filteredList.sort((a, b) => 
          (a.location || '').localeCompare(b.location || '')
        );
        break;
    }
    
    return filteredList;
  }
  
  get filteredReviews(): Review[] {
    let filteredList = [...this.pastReviews];
    
    // Apply search
    if (this.reviewSearchQuery) {
      const query = this.reviewSearchQuery.toLowerCase();
      filteredList = filteredList.filter(review => 
        review.text.toLowerCase().includes(query) || 
        review.restaurantName.toLowerCase().includes(query)
      );
    }
    
    // Apply filtering
    switch (this.reviewFilterOption) {
      case 'high-rating':
        filteredList = filteredList.filter(review => review.rating >= 4);
        break;
      case 'low-rating':
        filteredList = filteredList.filter(review => review.rating <= 3);
        break;
      case 'no-reply':
        filteredList = filteredList.filter(review => !review.replied);
        break;
    }
    
    return filteredList;
  }
}