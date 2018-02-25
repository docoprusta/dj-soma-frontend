import { Component } from '@angular/core';
import { Http } from '@angular/http';
import { SongService } from './services/song.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  constructor(private songService: SongService) {
    this.songService.sendJoined();
  }
}
