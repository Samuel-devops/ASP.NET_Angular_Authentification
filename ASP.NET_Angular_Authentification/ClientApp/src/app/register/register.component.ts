import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { NgToastService } from 'ng-angular-popup';
import ValidateForm from '../helpers/validateform';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css'],
})
export class RegisterComponent implements OnInit {
  registerForm!: FormGroup;
  showPassword: boolean = false;

  constructor(private fb: FormBuilder,
    private authService: AuthService,
    private router: Router,
    private toast: NgToastService) {}

  ngOnInit(): void {
    this.registerForm = this.fb.group({
      firstname: [
        '',
        Validators.compose([Validators.required, Validators.minLength(2)]),
      ],
      lastname: [
        '',
        Validators.compose([Validators.required, Validators.minLength(2)]),
      ],
      birthdate: ['', Validators.required],
      email: [
        '',
        Validators.compose([
          Validators.required,
          Validators.email,
          Validators.minLength(3),
        ]),
      ],
      password: [
        '',
        Validators.compose([Validators.required, Validators.minLength(8)]),
      ],
    });
  }

  onSubmit() {
    if (this.registerForm.valid) {
      // Send the obj to database
      this.authService.register(this.registerForm.value)
      .subscribe({
        next:(res)=>{
          this.toast.success({detail:"SUCCESS", summary:res.message, duration: 5000});
          this.registerForm.reset();
          this.router.navigate(['/login']);
        },
        error:(err)=>{
        const errorMessage = err?.error?.message || 'Something went wrong!';
        this.toast.error({detail: "ERROR", summary: errorMessage, duration: 5000});
        }
      })
    } 
    else {
      console.log('Register Form Invalid!');
      // throw the error using toaster and with required fields
      ValidateForm.validateAllFromFields(this.registerForm);
      this.toast.error({detail:"ERROR", summary:"Register Form Invalid!", duration: 5000});
    }
  }

  toggleShowPassword():void {
    this.showPassword = !this.showPassword;
  }

  get firstname() {
    return this.registerForm.controls.firstname;
  }
  get lastname() {
    return this.registerForm.controls.lastname;
  }
  get birthdate() {
    return this.registerForm.controls.birthdate;
  }
  get email() {
    return this.registerForm.controls.email;
  }
  get password() {
    return this.registerForm.controls.password;
  }
}
