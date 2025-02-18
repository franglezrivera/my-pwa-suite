// projects/pwa1/src/app/app.component.ts
import { Component } from '@angular/core';
import { SharedDataService } from 'shared-lib'; // Import the service

@Component({
  selector: 'app-root',
  styles: [],
  templateUrl: './app.component.html',
  standalone: false,
})
export class AppComponent {
  data: any;
  constructor(private sharedDataService: SharedDataService) {
    // Inject the service
    this.data = this.sharedDataService.getData();
  }
}
