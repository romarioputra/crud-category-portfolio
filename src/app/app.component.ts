import { Component, OnInit } from '@angular/core';
import { LoginApiService } from './services/login-api.service';
import { PageService } from './services/page.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit{

  constructor(private loginApi: LoginApiService, private page: PageService){}

  ngOnInit() {
    
  }
}
