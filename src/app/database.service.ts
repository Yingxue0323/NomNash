import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class DatabaseService {

  constructor(private http: HttpClient, private router: Router) { }

  addUser(user: any) {
    return this.http.post('http://localhost:3000/api/v1/users', user);
  }

  findRestaurantByName(name: string) {
    return this.http.get(`http://localhost:3000/api/v1/restaurant/${name}`);
  }
}
