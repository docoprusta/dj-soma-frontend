import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { SongService } from '../services/song.service';
import { Ng4LoadingSpinnerService } from 'ng4-loading-spinner';
import { DatePipe } from '@angular/common';
import { MinuteSecondsPipe } from '../minute-seconds.pipe';

@Component({
  selector: 'app-playlist',
  templateUrl: './playlist.component.html',
  styleUrls: ['./playlist.component.css']
})


export class PlaylistComponent implements OnInit {
  private playlist;
  private volume: number;
  constructor(
    public songService: SongService,
    private spinnerService: Ng4LoadingSpinnerService) { }
  private alreadyAdded: boolean;

  populateSongs() {
    this.spinnerService.show();

    this.songService.getPlaylist().subscribe(response => {
      this.songService.videoIds = [];
      this.songService.images = [];
      this.songService.titles = [];
      this.songService.durations = [];
      this.songService.progress = 0;

      this.playlist = response.json();
      this.playlist.forEach(element => {
        this.songService.videoIds.push(element.youtubeId);
        this.songService.images.push(element.imageUrl);
        this.songService.titles.push(element.title);
        this.songService.durations.push(element.duration);
      });
    });
    this.spinnerService.hide();
  }

  onVolumeChange() {
    this.songService.setVolume(this.volume).subscribe(data => {});
  }

  autoPlayCheckboxChanged() {
    this.songService.setAutoPlay(this.songService.autoPlay).subscribe();
  }

  ngOnInit() {
    this.populateSongs();

    this.songService.isFirst = false;

    this.songService.songAdded().subscribe(data => {
      const parsedJson = JSON.parse(data);
      if (!this.songService.videoIds.includes(parsedJson.youtubeId)) {
        this.songService.videoIds.push(parsedJson.youtubeId);
        this.songService.titles.push(parsedJson.title);
        this.songService.images.push(parsedJson.imageUrl);
        this.songService.durations.push(parsedJson.duration);
      }
    });

    setTimeout(() => {
      this.songService.canAddNewSong = true;
    }, 5000);

    setTimeout(() => {
      this.songService.alreadyAdded = false;
    }, 5000);

    this.songService.getTimePos();

    this.songService.getRemainingTime();

    this.songService.songEnded().subscribe(data => {
      this.populateSongs();
    });

    this.songService.getVolume().subscribe(data => {
      this.volume = data.json().volume;
    });

    this.songService.volumeChanged().subscribe(volume => {
      this.volume = parseInt(volume);
    });

    this.songService.getAutoplayChanged().subscribe(autoplay => {
      this.songService.autoPlay = !!autoplay;
    });

    this.songService.getAutoPlay().subscribe(data => {
      this.songService.autoPlay = data.json().value
    });

    this.songService.getSongDeleted().subscribe(data => {
      this.populateSongs();
    })
  }

  onDelete(index: number) {
    this.songService.deleteSong(this.songService.videoIds[index]).subscribe(
      data => console.log(data)
    );
  }
}
