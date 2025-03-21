import { Component, OnInit } from '@angular/core';

interface StudentProfile {
  name: string;
  email: string;
  role: string;
  password: string;
}

@Component({
  selector: 'app-student-profile',
  templateUrl: './student-profile.component.html',
  styleUrls: ['./student-profile.component.scss']
})
export class StudentProfileComponent implements OnInit {
  isEditing = false;
  studentProfile: StudentProfile = {
    name: 'John Doe',
    email: 'johndoe@student.monash.edu',
    role: 'Student',
    password: '********'
  };

  constructor() { }

  ngOnInit(): void {
  }

  toggleEdit(): void {
    this.isEditing = !this.isEditing;
  }

  saveChanges(): void {
    this.isEditing = false;
    console.log('Profile updated:', this.studentProfile);
  }
}