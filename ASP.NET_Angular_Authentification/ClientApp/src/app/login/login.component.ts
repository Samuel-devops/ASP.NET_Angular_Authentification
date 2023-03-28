import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../services/auth.service';
import ValidateForm from '../helpers/validateform';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
})
export class LoginComponent implements OnInit {
  loginForm!: FormGroup;
  showPassword: boolean = false;

  constructor(private fb: FormBuilder,
    private authService: AuthService,
    private router: Router) {}

  ngOnInit(): void {
    this.loginForm = this.fb.group({
      email: [
        '',
        Validators.compose([
          Validators.required,
          Validators.email,
          Validators.maxLength(50),
          Validators.minLength(3),
        ]),
      ],
      password: [
        '',
        Validators.compose([Validators.required, Validators.minLength(8)]),
      ],
    });
  }

  onLogin() {
    if (this.loginForm.valid) {
      console.log(this.loginForm.value);
      // Send the obj to database
      this.authService.login(this.loginForm.value)
      .subscribe({
        next:(res)=>{
          alert(res.message);
          this.loginForm.reset();
          this.router.navigate(['']);
        },
        error:(err)=>{
          alert(err?.error.message)
        }
      })
    } else {
      console.log('Form is invalid!');
      // throw the error using toaster and with required fields
      ValidateForm.validateAllFromFields(this.loginForm);
      alert('Form is Invalid!');
    }
  }

  toggleShowPassword():void {
    this.showPassword = !this.showPassword;
  }

  get email() {
    return this.loginForm.controls.email;
  }
  get password() {
    return this.loginForm.controls.password;
  }
}
