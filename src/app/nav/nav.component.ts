import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AppService } from '../app.service';
import { EventsService } from '../events.service';

@Component({
  selector: 'app-nav',
  templateUrl: './nav.component.html',
  styleUrls: ['./nav.component.css']
})
export class NavComponent {
  profile : any = null;
  constructor(
    private appService : AppService,
    private eventsService : EventsService,
    private router : Router,
  ) { }

  ngOnInit(): void {
    if(localStorage.getItem("accesstoken")) {
      this.appService.getProfile().subscribe((data: any) => {
        this.profile = data;
      });
    }
    this.eventsService.authEmitter.subscribe((profile) => {
      this.profile = profile;
    });
  }
  logout(){
    this.eventsService.authEmitter.emit(null);
    localStorage.removeItem("accesstoken");
    // this.router.navigate(['/login']);
  }
}
