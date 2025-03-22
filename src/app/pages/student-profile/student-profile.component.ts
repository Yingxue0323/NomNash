import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

interface StudentProfile { // StudentProfile object containing all relevant variables 
  name: string;
  email: string;
  role: string;
  password: string;
}

@Component({
  selector: 'app-student-profile',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './student-profile.component.html',
  styleUrls: ['./student-profile.component.scss']
})
export class StudentProfileComponent {
  isEditing = false; // Track when profile is in edit mode 
  studentProfile: StudentProfile = { // Object holding student profile details, all initialised with default values
    name: 'John Doe',
    email: 'johndoe@student.monash.edu',
    role: 'Student',
    password: '********'
  };

  toggleEdit(): void { // Toggles editing depending on boolean value 
    this.isEditing = !this.isEditing;
  }

  saveChanges(): void { // Save changes function
    this.isEditing = false;
    console.log('Profile updated:', this.studentProfile);
  }
}