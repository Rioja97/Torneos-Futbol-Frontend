import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Auth } from '../../services/auth';
import { AuthResponseDTO } from '../../models/auth-response.dto';
import { HttpErrorResponse } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';

@Component({
  selector: 'app-login',
  imports: [ReactiveFormsModule, CommonModule, RouterLink],
  templateUrl: './login.html',
  styleUrl: './login.css',
})
export class Login {

  loginForm: FormGroup;
  errorMessage: string | null = null;

  constructor(
    private fb: FormBuilder,
    private authService: Auth,
    private router: Router
  ){
    this.loginForm = this.fb.group({
      username: ["", [Validators.required]],
      password: ["", [Validators.required]],
    });
  }

  onSubmit(){

    if(this.loginForm.invalid){
      return;
    }

    this.errorMessage = null;

    this.authService.login(this.loginForm.value).subscribe({
      next: (response: AuthResponseDTO) => {
        console.log("Login exitoso!", response);

        if(response.token){
          localStorage.setItem('authToken', response.token);
        }

        this.router.navigate(['/home']);
      }, error: (err: HttpErrorResponse) => {
        if(err.status === 401){
          this.errorMessage = "Credenciales inválidas, intente nuevamente";
        } else{
          this.errorMessage = "Error en el servidor, intente mas tarde";
        }
        console.error("Error en el login", err);
      }
    });
  }
}
