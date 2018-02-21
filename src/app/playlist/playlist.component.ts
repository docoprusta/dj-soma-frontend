import { Component, OnInit } from '@angular/core';
import { SongService } from '../services/song.service';
import { Ng4LoadingSpinnerService } from 'ng4-loading-spinner';

@Component({
  selector: 'app-playlist',
  templateUrl: './playlist.component.html',
  styleUrls: ['./playlist.component.css']
})


export class PlaylistComponent implements OnInit {
  private playlist;
  public videoIds = [];
  public images = [];
  public titles = [];

  constructor(
    private songService: SongService,
    private spinnerService: Ng4LoadingSpinnerService) {}

  ngOnInit() {
    this.spinnerService.show();
    setTimeout(() => {
      this.songService.getPlaylist().subscribe(response => {
        this.playlist = response.json();
        this.playlist.forEach(element => {
          this.videoIds.push(element.youtubeId);
          this.images.push(element.imageUrl);
          this.titles.push(element.title);
        });
      });
      this.spinnerService.hide();
    }, 1000);
    
    this.songService.getMessage();
  }
}
