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
  public searchTerm$ = new Subject<string>();;

  constructor(
    private http: Http,
    private router: Router,
    private songService: SongService,
    public youtubeService: YoutubeService
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

  onBreadCrumbClick(index) {
    this.songService.sendPostSong(index);
    this.router.navigateByUrl('/playlist');
  }

}
