import { Component, OnInit } from '@angular/core';
import { Http } from '@angular/http';
import { Router } from '@angular/router';
import { SongService } from '../services/song.service';
import { Song } from '../models/song';
import { Observable } from 'rxjs/Observable';
import { Subject } from 'rxjs/Subject';
import { YoutubeService } from '../services/youtube.service';

@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.css']
})
export class SearchComponent {

  title = 'app';
  private results: Object;
  private searchTerm$ = new Subject<string>();;

  constructor(
    private http: Http,
    private router: Router,
    private songService: SongService,
    private youtubeService: YoutubeService
  ) {
    this.youtubeService.search(this.searchTerm$)
      .subscribe(results => {
        this.results = results.json();
        this.youtubeService.populateResults(this.results);
      });
  }

  ngOnInit() {
    this.youtubeService.clearEveryArray();
  }

  postSong(index: number) {
    const newSong = new Song(
      this.youtubeService.titles[index],
      this.youtubeService.videoIds[index],
      this.youtubeService.images[index]
    );
    this.songService.postSong(newSong).subscribe(response => console.log(response.text()));
  }

  onBreadCrumbClick(index) {
    this.postSong(index);
    this.router.navigateByUrl('/playlist');
  }

}
