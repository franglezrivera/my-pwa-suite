// projects/pwa1/src/app/app.component.ts
import { Component } from '@angular/core';
import { SharedDataService } from 'shared-lib'; // Import the service

@Component({
  selector: 'app-root',
  template: `
    <h2>PWA 1 App</h2>
    <shared-button label="My PWA Button"></shared-button>
    <ul>
      <li *ngFor="let item of data">{{ item }}</li>
    </ul>
  `,
  styles: [],
  standalone: false,
})
export class AppComponent {
  data: any;
  constructor(private sharedDataService: SharedDataService) {
    // Inject the service
    this.data = this.sharedDataService.getData();
  }
}
