import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: '',
    loadChildren: () => import('./pages/home-page/home-page.component').then(m => m.HomePageComponent)
  },
  {
    path: 'student',
    loadComponent: () => import('./pages/student-profile/student-profile.component').then(m => m.StudentProfileComponent)
  },
  {
    path: 'business',
    loadComponent: () => import('./pages/business-profile/business-profile.component').then(m => m.BusinessProfileComponent)
  },
  // 其他路由...
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { } 