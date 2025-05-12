import { Component, HostListener, OnInit } from "@angular/core"
import { Router, NavigationEnd } from "@angular/router"
import { HttpClient } from "@angular/common/http"
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { filter } from 'rxjs/operators';

interface UserInfo {
  name: string;
  avatarUrl: string;
  role: string;
  email: string;
  id?: string;
}

interface AuthForm {
  username: string;
  password: string;
  role?: string;
}

@Component({
  selector: "app-header",
  templateUrl: "./header.component.html"
})
<<<<<<< HEAD
export class HeaderComponent {
  constructor(public router: Router) {}

  findRestaurantByName(name: string) {
    if (name) {
      this.router.navigate(["/restaurant", name])
    } else {
      this.router.navigate(["/"])
    }
  }
=======
export class HeaderComponent implements OnInit {
  isMenuOpen = false;
  showAuthModal = false;
  authMode: 'login' | 'signup' = 'login';
  isLoggedIn = false;
  userInfo: UserInfo | null = null;
  authForm: AuthForm = { username: '', password: '' };
  selectedRole: string | null = null; // 用户选择的角色
  
  availableRoles = [
    { value: 'USER', label: 'Student' },
    { value: 'OWNER', label: 'Business Owner' }
    // 注意：管理员角色通常不在注册流程中提供，而是通过后台分配
    // { value: 'ADMIN', label: 'Administrator' }
  ];
  
  private apiUrl = '/api/v1';
  
  constructor(private router: Router, private http: HttpClient) {
    // 监听路由变化，每次导航结束后检查登录状态
    this.router.events.pipe(
      filter(event => event instanceof NavigationEnd)
    ).subscribe(() => {
      this.checkLoginStatus();
    });
  }
  
  ngOnInit() {
    // 组件初始化时检查登录状态
    this.checkLoginStatus();
  }
  
  checkLoginStatus() {
    console.log('Checking login status...');
    
    // 首先从localStorage中获取用户信息
    const storedUser = localStorage.getItem('currentUser');
    if (storedUser) {
      try {
        this.userInfo = JSON.parse(storedUser);
        this.isLoggedIn = true;
        console.log('User restored from localStorage:', this.userInfo);
      } catch (e) {
        console.error('Error parsing stored user data:', e);
        localStorage.removeItem('currentUser');
      }
    }
    
    // 检查本地存储中是否有登录状态变化的标记
    const loginChanged = localStorage.getItem('login_changed');
    if (loginChanged) {
      localStorage.removeItem('login_changed');
    }

    // 向后端验证当前登录状态
    this.http.get<any>(`${this.apiUrl}/users/profile`, { withCredentials: true })
      .subscribe({
        next: (response) => {
          console.log('Profile data received:', response);
          
          // 处理嵌套的响应格式 - 数据在 response.data 中
          let userData;
          if (response.code === 2000 && response.data) {
            userData = response.data;
          } else {
            userData = response;
          }
          
          // 确保角色信息正确
          console.log('User role from API:', userData.role);
          
          // 从localStorage检查是否有用户选择的角色
          const signupRole = localStorage.getItem('signup_role');
          if (signupRole) {
            console.log('Found signup role in localStorage:', signupRole);
            userData.role = signupRole;
            // 清除localStorage中的角色信息
            localStorage.removeItem('signup_role');
          }
          
          this.isLoggedIn = true;
          this.userInfo = {
            name: userData.name,
            email: userData.email,
            role: userData.role || 'USER', // 确保有默认角色
            avatarUrl: userData.avatar || '',
            id: userData.id || ''
          };
          
          console.log('User info set:', this.userInfo);
          
          // 将用户信息存储在本地，以便其他组件使用
          localStorage.setItem('currentUser', JSON.stringify(this.userInfo));
        },
        error: (err) => {
          console.error('Error fetching profile:', err);
          // 如果API调用失败但本地有存储的用户信息，保留本地状态
          if (!this.isLoggedIn || !this.userInfo) {
            this.isLoggedIn = false;
            this.userInfo = null;
            localStorage.removeItem('currentUser');
          } else {
            console.log('Using cached user information due to API error');
          }
        }
      });
  }
  
  submitAuthForm() {
    const endpoint = this.authMode === 'login' ? 'login' : 'signup';
    
    // 只有在注册时才使用角色信息
    const payload = this.authMode === 'signup' ? 
      this.authForm : 
      { username: this.authForm.username, password: this.authForm.password };
    
    this.http.post(`${this.apiUrl}/auth/${endpoint}`, payload, { withCredentials: true })
      .subscribe({
        next: (response) => {
          console.log(`${this.authMode} successful`, response);
          this.isLoggedIn = true;
          this.closeAuthModal();
          this.checkLoginStatus(); // 重新获取用户信息
          
          // 标记登录状态已变化
          localStorage.setItem('login_changed', 'true');
          
          // 根据角色进行路由跳转
          if (this.authMode === 'signup' && this.authForm.role === 'OWNER') {
            this.router.navigate(['/business']);
          } else if (this.authMode === 'signup') {
            this.router.navigate(['/student']);
          }
        },
        error: (error: any) => {
          console.error(`${this.authMode} failed:`, error);
          alert(`${this.authMode === 'login' ? 'Login' : 'Sign up'} failed. Please try again.`);
        }
      });
  }
  
  toggleMenu() {
    this.isMenuOpen = !this.isMenuOpen;
  }
  
  openAuthModal() {
    this.showAuthModal = true;
    document.body.classList.add('overflow-hidden');
  }
  
  closeAuthModal() {
    this.showAuthModal = false;
    document.body.classList.remove('overflow-hidden');
    this.authForm = { username: '', password: '' };
  }
  
  toggleAuthMode() {
    this.authMode = this.authMode === 'login' ? 'signup' : 'login';
    this.selectedRole = null;
  }
  
  loginWithGoogle() {
    // 使用正确的认证URL
    let googleAuthUrl = 'http://localhost:3000/api/v1/auth/login';
    
    // 创建state参数用于存储角色信息和模式
    let state = {};
    
    if (this.authMode === 'signup' && this.selectedRole) {
      // 构建包含角色的state对象
      state = {
        role: this.selectedRole,
        mode: 'signup'
      };
      
      // 为安全起见，同时在localStorage中保存角色信息
      localStorage.setItem('signup_role', this.selectedRole);
      localStorage.setItem('auth_state', JSON.stringify(state));
      console.log('Role set for signup:', this.selectedRole);
    }
    
    // 将state编码为URL安全的字符串
    const stateParam = encodeURIComponent(JSON.stringify(state));
    googleAuthUrl = `${googleAuthUrl}?state=${stateParam}`;
    
    console.log('Redirecting to Auth URL with state:', googleAuthUrl);
    window.location.href = googleAuthUrl;
  }
  
  logout(event: Event) {
    event.preventDefault();
    console.log('Logout initiated');
    
    this.http.delete(`${this.apiUrl}/auth/logout`, { withCredentials: true })
      .subscribe({
        next: (response) => {
          console.log('Logout successful', response);
          this.isLoggedIn = false;
          this.userInfo = null;
          localStorage.removeItem('currentUser');
          localStorage.setItem('login_changed', 'true');
          this.router.navigate(['/']);
          this.isMenuOpen = false;
        },
        error: (error: any) => {
          console.error('Logout failed:', error);
          // 即使API调用失败，也清除本地状态
          this.isLoggedIn = false;
          this.userInfo = null;
          localStorage.removeItem('currentUser');
          localStorage.setItem('login_changed', 'true');
          this.router.navigate(['/']);
          this.isMenuOpen = false;
          alert('Logout API call failed, but local session has been cleared.');
        }
      });
  }
  
  @HostListener('document:click', ['$event'])
  onDocumentClick(event: MouseEvent) {
    const target = event.target as HTMLElement;
    const dropdown = document.querySelector('.relative');
    
    if (dropdown && !dropdown.contains(target)) {
      this.isMenuOpen = false;
    }
  }
  
  // Add event listener for open-auth-modal events
  @HostListener('document:open-auth-modal', ['$event'])
  onOpenAuthModal(event: Event) {
    console.log('Received open-auth-modal event in header component');
    this.openAuthModal();
  }
  
  goToProfile() {
    // 首先尝试从localStorage获取最新的用户信息
    const storedUser = localStorage.getItem('currentUser');
    let role = 'USER'; // 默认角色
    
    if (storedUser) {
      try {
        const userData = JSON.parse(storedUser);
        role = userData.role || 'USER';
      } catch (e) {
        console.error('Error parsing stored user data:', e);
      }
    } else if (this.userInfo) {
      // 如果localStorage中没有数据，则使用组件中的用户信息
      role = this.userInfo.role;
    }
    
    console.log('Navigating to profile with role:', role);
    
    // 根据角色导航到相应的页面
    if (role === 'OWNER') {
      this.router.navigate(['/business']);
    } else {
      this.router.navigate(['/student']);
    }
    
    this.isMenuOpen = false;
  }
  
  // 选择角色
  selectRole(role: string) {
    this.selectedRole = role;
  }
>>>>>>> 7678bcc (Feature: lots of)
}