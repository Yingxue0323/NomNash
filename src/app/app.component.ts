import { Component, OnInit } from '@angular/core';
import { Router, NavigationEnd, Event, ActivatedRoute } from '@angular/router';
import { filter } from 'rxjs/operators';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  showHeaderFooter = true;
  private apiUrl = '/api/v1';

  constructor(
    private router: Router, 
    private route: ActivatedRoute,
    private http: HttpClient
  ) {
    this.router.events.pipe(
      filter((event): event is NavigationEnd => event instanceof NavigationEnd)
    ).subscribe((event) => {
      // Hide header/footer for specific routes
      this.showHeaderFooter = !(
        event.url === '/launch' || 
        event.url.includes('/signup')
      );
      
      // 每次路由导航完成后，广播登录状态检查
      this.broadcastLoginStatus();
    });
  }
  
  ngOnInit() {
    // 初始化时检查登录状态
    this.ensureConsistentLoginState();
    
    // Check if redirected from Google login
    this.route.queryParams.subscribe(params => {
      console.log('Query params received:', params);
      
      if (params['auth'] === 'success') {
        let roleToUse;
        
        // 检查URL中是否有state参数
        if (params['state']) {
          try {
            const state = JSON.parse(decodeURIComponent(params['state']));
            console.log('State from URL:', state);
            if (state && state.role) {
              roleToUse = state.role;
              console.log('Role found in state parameter:', roleToUse);
            }
          } catch (e) {
            console.error('Error parsing state parameter:', e);
          }
        }
        
        // 如果URL的state中没有角色信息，检查localStorage
        if (!roleToUse) {
          // 检查localStorage中保存的auth_state
          const authState = localStorage.getItem('auth_state');
          if (authState) {
            try {
              const state = JSON.parse(authState);
              if (state && state.role) {
                roleToUse = state.role;
                console.log('Role found in localStorage auth_state:', roleToUse);
              }
            } catch (e) {
              console.error('Error parsing auth_state from localStorage:', e);
            }
            // 清除localStorage中的状态
            localStorage.removeItem('auth_state');
          }
          
          // 如果还没找到，检查直接保存的role
          if (!roleToUse) {
            roleToUse = localStorage.getItem('signup_role');
            console.log('Role from signup_role in localStorage:', roleToUse);
          }
        }
        
        if (roleToUse) {
          // 清除localStorage中的角色信息
          localStorage.removeItem('signup_role');
          localStorage.removeItem('auth_state');
          
          // 更新用户角色并导航
          this.updateUserRole(roleToUse);
        } else {
          console.log('No role found, using profile data as is');
          // 检查当前用户信息
          this.checkCurrentUser();
        }
      }
    });
  }
  
  /**
   * 确保登录状态一致性
   * 检查cookie和localStorage之间的状态是否一致
   */
  private ensureConsistentLoginState() {
    // 从localStorage获取当前用户信息
    const currentUser = localStorage.getItem('currentUser');
    
    // 向后端验证当前用户状态
    this.http.get<any>(`${this.apiUrl}/users/profile`, { withCredentials: true })
      .subscribe({
        next: (response) => {
          console.log('Profile data received in loginState check:', response);
          
          // 处理嵌套的响应格式
          let userData;
          if (response.code === 2000 && response.data) {
            userData = response.data;
          } else {
            userData = response;
          }
          
          // 后端验证成功，用户已登录
          const userInfo = {
            name: userData.name,
            email: userData.email,
            role: userData.role || 'USER',
            avatarUrl: userData.avatar || '',
            id: userData.id || ''
          };
          
          // 更新localStorage
          localStorage.setItem('currentUser', JSON.stringify(userInfo));
          
          // 广播登录状态变化
          this.broadcastLoginStatus(true);
        },
        error: (error) => {
          console.error('Error verifying login state:', error);
          
          // 后端验证失败，用户未登录
          // 如果localStorage中仍有用户信息，清除它
          if (currentUser) {
            localStorage.removeItem('currentUser');
            // 广播登录状态变化
            this.broadcastLoginStatus(false);
          }
        }
      });
  }
  
  /**
   * 广播登录状态变化
   * @param isLoggedIn 可选的登录状态
   */
  private broadcastLoginStatus(isLoggedIn?: boolean) {
    const status = isLoggedIn !== undefined ? 
      isLoggedIn : 
      localStorage.getItem('currentUser') !== null;
    
    // 使用自定义事件通知其他组件
    const event = new CustomEvent('login-status-changed', { 
      detail: { isLoggedIn: status },
      bubbles: true 
    });
    
    // 从DOM根节点广播事件
    document.dispatchEvent(event);
    
    // 同时更新localStorage，以便跨页面共享
    if (status) {
      localStorage.setItem('login_status', 'logged_in');
    } else {
      localStorage.removeItem('login_status');
    }
  }
  
  // Method to update user role
  private updateUserRole(role: string) {
    console.log('Updating user role to:', role);
    
    // 先在本地保存角色信息，确保即使API请求失败，本地状态也正确
    const currentUser = localStorage.getItem('currentUser');
    if (currentUser) {
      try {
        const userData = JSON.parse(currentUser);
        userData.role = role;
        localStorage.setItem('currentUser', JSON.stringify(userData));
      } catch (e) {
        console.error('Error updating local user data:', e);
      }
    }
    
    // 检查正确的API路径
    const updateRoleUrl = `${this.apiUrl}/users/profile/role`;
    
    this.http.post(updateRoleUrl, { role }, { withCredentials: true })
      .subscribe({
        next: (response) => {
          console.log('User role updated successfully', response);
          
          // 设置session标记，可能需要在其他组件中获取
          localStorage.setItem('login_changed', 'true');
          
          // 广播登录状态变化
          this.broadcastLoginStatus(true);
          
          // 重定向到相应页面
          this.redirectBasedOnRole(role);
        },
        error: (error) => {
          console.error('Failed to update user role via API:', error);
          
          // 尝试替代API
          this.tryAlternativeUpdateMethod(role);
        }
      });
  }
  
  // 尝试替代方法更新用户角色
  private tryAlternativeUpdateMethod(role: string) {
    const alternativeUrl = `${this.apiUrl}/users/profile`;
    
    this.http.put(alternativeUrl, { role }, { withCredentials: true })
      .subscribe({
        next: (response) => {
          console.log('User role updated with alternative method', response);
          this.broadcastLoginStatus(true);
          this.redirectBasedOnRole(role);
        },
        error: (error) => {
          console.error('All role update attempts failed:', error);
          
          // API调用失败，但仍然基于存储的角色重定向
          this.broadcastLoginStatus(true);
          this.redirectBasedOnRole(role);
        }
      });
  }
  
  // 基于角色重定向到相应页面
  private redirectBasedOnRole(role: string) {
    if (role === 'OWNER') {
      this.router.navigate(['/business']);
    } else {
      this.router.navigate(['/student']);
    }
  }
  
  // 检查当前用户信息并导航到相应页面
  private checkCurrentUser() {
    this.http.get<any>(`${this.apiUrl}/users/profile`, { withCredentials: true })
      .subscribe({
        next: (response) => {
          console.log('Profile data received in checkCurrentUser:', response);
          
          // 处理嵌套的响应格式
          let userData;
          if (response.code === 2000 && response.data) {
            userData = response.data;
          } else {
            userData = response;
          }
          
          // 保存用户信息到localStorage
          const userInfo = {
            name: userData.name,
            email: userData.email,
            role: userData.role || 'USER',
            avatarUrl: userData.avatar || '',
            id: userData.id || ''
          };
          
          localStorage.setItem('currentUser', JSON.stringify(userInfo));
          
          // 广播登录状态变化
          this.broadcastLoginStatus(true);
          
          // 基于角色导航
          this.redirectBasedOnRole(userInfo.role);
        },
        error: (error) => {
          console.error('Error fetching user profile:', error);
          localStorage.removeItem('currentUser');
          this.broadcastLoginStatus(false);
          this.router.navigate(['/']);
        }
      });
  }
}