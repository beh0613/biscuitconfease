import { Component } from '@angular/core';
import { RouterOutlet, RouterLink, RouterLinkActive } from '@angular/router';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, RouterLink, RouterLinkActive], // Added RouterLink imports here
  templateUrl: './app.html', // Make sure this matches your actual file name (app.html or app.component.html)
  styleUrl: './app.css'
})
export class App {
  title = 'conference-FE';
}
