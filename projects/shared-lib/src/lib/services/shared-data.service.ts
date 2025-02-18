import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class SharedDataService {
  getData() {
    return ['lorem', 'lorem', 'lorem', 'lorem', 'ipsum']; // Example data
  }
}
