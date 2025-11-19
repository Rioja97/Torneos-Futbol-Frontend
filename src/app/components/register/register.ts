import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { RouterLink, Router } from '@angular/router';
import { Auth } from '../../services/auth';

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
  successMessage: string | null = null;

  constructor(
    private fb: FormBuilder,
    private authService: Auth,
    private router: Router
  ){
    this.registerForm = this.fb.group({
      username: ['', [Validators.required]],
      password: ['', [Validators.required, Validators.minLength(6)]]
    });
  }

  onSubmit(){

    if(this.registerForm.invalid) return;

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
        if(err.error & err.error.message){
          this.errorMessage = err.error.message
        } else{
          this.errorMessage = "Error al registrar usuario"
        }
      }
    });
  }
}
