import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { RouterLink, Router } from '@angular/router';
import { AuthService } from '../../services/authService';
import { ErrorHandlerService } from '../../services/error-handler.service';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule, RouterLink],
  templateUrl: './register.html',
  styleUrl: './register.css',
})
export class Register {

  registerForm: FormGroup;
  errorMessage: string | null = null;
  errorMessages: string[] | null = null;
  successMessage: string | null = null;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router
    , private errorHandler: ErrorHandlerService
  ){
    this.registerForm = this.fb.group({
      username: ['', [Validators.required]],
      password: ['', [Validators.required, Validators.minLength(6)]]
    });
  }

  onSubmit(){

    if(this.registerForm.invalid) return;
    this.errorMessages = null;

    this.authService.register(this.registerForm.value).subscribe({
      next: (res) => {
        console.log(res);
        this.successMessage = "Usuario creado exitósamente! Redirigiendo al login...";

        setTimeout(() => {
          this.router.navigate(['/login']);
        }, 2000);
      }, 
      error: (err) => {
        console.error(err);
        if (err.status === 400 || err.error) {
          this.errorMessages = this.errorHandler.formatErrorList(err);
          this.errorMessage = null;
        } else{
          this.errorMessage = "Error al registrar usuario"
        }
      }
    });
  }
}
