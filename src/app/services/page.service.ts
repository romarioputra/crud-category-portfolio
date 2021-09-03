import { Injectable } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class PageService {
  private currentSection = "";
  constructor(private router: Router) { 
    this.setRouteSubscription();
  }

  public setRouteSubscription(): void {
    this.router.events.subscribe((e) => {
      if (e instanceof NavigationEnd) {
        this.currentSection = e.url.split('/')[2];
      }
    })
  }
  public getCurrentSection(): string {
    return this.currentSection;
  }
}
