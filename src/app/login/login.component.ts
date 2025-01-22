import { Component } from '@angular/core';
import { AuthService } from '../auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  username: string = '';
  password: string = '';
  errorMessage: string = '';

  constructor(private authService: AuthService, private router: Router) {}

  onLogin(): void {
    this.authService.login(this.username, this.password).subscribe(
      (response) => {
        console.log('Login successful:', response);
        alert(`Welcome ${response.user}!`);
        // this.router.navigate(['/dashboard']); // เปลี่ยนเส้นทางไปหน้า Dashboard
      },
      (error) => {
        console.error('Login failed:', error);
        this.errorMessage = error.error.message || 'An error occurred.';
      }
    );
  }
}
