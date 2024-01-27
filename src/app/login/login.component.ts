import { Component } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { AppService } from '../app.service';
import { EventsService } from '../events.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  constructor(
    private appService : AppService,
    private eventsService : EventsService,
    private router : Router
  ) {}
  loginForm: FormGroup = new FormGroup({
    email: new FormControl(''),
    password: new FormControl(''),
  });
  loginSubmit() : void {
    this.appService.login(this.loginForm.value)
    .subscribe((data: any) => {
      localStorage.setItem("accesstoken", String(data.token));
      this.eventsService.authEmitter.emit(data.user);
      this.router.navigate(['/']);
    }, (error) => {
      alert(error.error.message);
    });
  }
}
