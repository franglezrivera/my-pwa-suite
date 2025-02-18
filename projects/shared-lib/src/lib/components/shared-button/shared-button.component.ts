import { Component, Input } from '@angular/core';

@Component({
  selector: 'shared-button',
  template: `<button>{{ label }}</button>`,
  styles: [],
  standalone: false,
})
export class SharedButtonComponent {
  @Input() label: string = 'Click me';
}
