import { Component } from '@angular/core';
import { AuthComponent } from '../auth.component';
import { FormsModule } from '@angular/forms';
import { ApiService } from '../../service/api.service';

@Component({
  selector: 'app-login',
  imports: [AuthComponent, FormsModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css',
})
export class LoginComponent {
  email!: string;
  password!: string;
  submitted = false;
  isLoading = false;

  constructor(private apiService: ApiService) {}

  onSubmit() {
    this.submitted = true;
    console.log(this.email, this.password, 'clicked');
    this.apiService
      .login({ email: this.email, password: this.password })
      .subscribe((v) => console.log(v));
  }
}
