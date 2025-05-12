import { Component, OnInit } from '@angular/core';
import { Location } from '@angular/common';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { StarRatingComponent } from 'src/app/components/star-rating/star-rating.component';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';

interface UserProfile {
  name: string;
  email: string;
  googleId: string;
  avatar?: string;
  role: string;
  lastLoginAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

@Component({
  selector: 'app-student-profile',
  standalone: true,
  imports: [CommonModule, FormsModule, StarRatingComponent],
  templateUrl: './student-profile.component.html',
  styleUrls: ['./student-profile.component.scss']
})
export class StudentProfileComponent implements OnInit {
  isEditing = false;
  defaultAvatar = '/assets/nomnash-logo.png';
  profile: UserProfile = {
    name: '',
    email: '',
    googleId: '',
    avatar: this.defaultAvatar,
    role: 'USER',
    createdAt: new Date(),
    updatedAt: new Date()
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
  loading = true;
  error = '';

  constructor(private location: Location, private http: HttpClient, private router: Router) {}

  ngOnInit() {
    this.checkUserRole();
    this.fetchUserProfile();
  }

  fetchUserProfile() {
    this.loading = true;
    this.http.get<any>('/api/v1/users/profile', { withCredentials: true })
      .subscribe({
        next: (response) => {
          console.log('Profile data received:', response);
          
          // 处理嵌套的响应格式 - 数据在 response.data 中
          if (response.code === 2000 && response.data) {
            const userData = response.data;
            
            // 预加载头像，验证是否可用
            if (userData.avatar) {
              this.validateImageUrl(userData.avatar).then(isValid => {
                this.profile = {
                  name: userData.name,
                  email: userData.email,
                  googleId: userData.googleId,
                  avatar: isValid ? userData.avatar : this.defaultAvatar,
                  role: userData.role,
                  lastLoginAt: userData.lastLoginAt ? new Date(userData.lastLoginAt) : undefined,
                  createdAt: userData.createdAt ? new Date(userData.createdAt) : new Date(),
                  updatedAt: userData.updatedAt ? new Date(userData.updatedAt) : new Date()
                };
              }).catch(() => {
                // 如果验证失败，使用默认头像
                this.setProfileWithDefaultAvatar(userData);
              });
            } else {
              this.setProfileWithDefaultAvatar(userData);
            }
          } else {
            console.error('Invalid response format:', response);
            this.error = '服务器返回了无效的数据格式';
          }
          
          this.loading = false;
        },
        error: (err) => {
          console.error('Error fetching user profile:', err);
          this.error = 'Failed to load profile. Please try again later.';
          this.loading = false;
        }
      });
  }

  goBack() { this.location.back(); }

  toggleEdit() { 
    // 暂时不允许编辑
    console.log('Editing is currently disabled');
  }

  saveChanges() {
    // 暂时不允许修改
    this.isEditing = false;
  }

  formatDate(date: Date | undefined): string {
    if (!date) return 'N/A';
    return new Date(date).toLocaleDateString();
  }
  
  handleImageError(event: Event) {
    const imgElement = event.target as HTMLImageElement;
    console.log('Image failed to load:', imgElement.src);
    imgElement.src = this.defaultAvatar;
  }
  
  // 辅助方法：使用默认头像设置用户资料
  private setProfileWithDefaultAvatar(userData: any) {
    this.profile = {
      name: userData.name,
      email: userData.email,
      googleId: userData.googleId,
      avatar: this.defaultAvatar,
      role: userData.role,
      lastLoginAt: userData.lastLoginAt ? new Date(userData.lastLoginAt) : undefined,
      createdAt: userData.createdAt ? new Date(userData.createdAt) : new Date(),
      updatedAt: userData.updatedAt ? new Date(userData.updatedAt) : new Date()
    };
  }
  
  // 辅助方法：验证图片URL是否可用
  private validateImageUrl(url: string): Promise<boolean> {
    return new Promise((resolve) => {
      const img = new Image();
      img.onload = () => resolve(true);
      img.onerror = () => resolve(false);
      img.src = url;
      // 设置5秒超时
      setTimeout(() => resolve(false), 5000);
    });
  }

  // 检查用户角色，确保只有学生（USER角色）可以访问
  private checkUserRole() {
    try {
      const userString = localStorage.getItem('currentUser');
      if (!userString) {
        console.log('未登录用户，重定向至首页');
        this.router.navigate(['/']);
        return;
      }
      
      const user = JSON.parse(userString);
      if (user.role !== 'USER') {
        console.log('非学生用户尝试访问学生页面，重定向至合适页面');
        if (user.role === 'OWNER') {
          this.router.navigate(['/business']);
        } else {
          this.router.navigate(['/']);
        }
      }
    } catch (error) {
      console.error('解析用户信息出错', error);
      this.router.navigate(['/']);
    }
  }
}
