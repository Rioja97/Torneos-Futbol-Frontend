import { Component } from '@angular/core';
import { Route, Router, RouterLink } from '@angular/router';

@Component({
  selector: 'app-home',
  imports: [RouterLink],
  templateUrl: './home.html',
  styleUrl: './home.css',
})
export class Home {

    constructor(private router: Router){}

    logout(){
      localStorage.removeItem('authToken');
      this.router.navigate(['/login']);
    }
}
