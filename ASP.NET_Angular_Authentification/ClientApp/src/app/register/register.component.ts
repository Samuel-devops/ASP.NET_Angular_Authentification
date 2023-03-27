import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import ValidateForm from '../helpers/validateform';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css'],
})
export class RegisterComponent implements OnInit {
  registerForm!: FormGroup;

  constructor(private fb: FormBuilder,
    private authService: AuthService,
    private router: Router) {}

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
      console.log(this.registerForm.value);
      // Send the obj to database
      this.authService.register(this.registerForm.value)
      .subscribe({
        next:(res)=>{
          alert(res.message);
          this.registerForm.reset();
          this.router.navigate(['/login']);
        },
        error:(err)=>{
          alert(err?.error.message);
        }
      })
    } else {
      console.log('Register Form Invalid!');
      // throw the error using toaster and with required fields
      ValidateForm.validateAllFromFields(this.registerForm);
      alert('Register Form Invalid!');
    }
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
