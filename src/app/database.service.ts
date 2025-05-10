import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class DatabaseService {

  constructor(private http: HttpClient, private router: Router) { }

  addUser(user: any) {
    return this.http.post('http://localhost:3000/api/users', user);
  }
}
