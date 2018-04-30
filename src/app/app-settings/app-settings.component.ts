import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { Router } from '@angular/router';
import { SongService } from '../services/song.service';

@Component({
  selector: 'app-app-settings',
  templateUrl: './app-settings.component.html',
  styleUrls: ['./app-settings.component.css']
})
export class AppSettingsComponent implements OnInit {
  @ViewChild("baseUrlInput") baseUrlInput: ElementRef;
  @ViewChild("waitingTimeInput") waitingTimeInput: ElementRef;

  public baseUrl: string;

  constructor(private router: Router, private songService: SongService) { }

  ngOnInit() {
    this.baseUrlInput.nativeElement.value = localStorage.getItem("baseUrl");

    this.songService.getWaitingTimeChanged().subscribe(waitingTime => {
      console.log(waitingTime);
      this.waitingTimeInput.nativeElement.value = waitingTime
    });

    if (this.songService.isAdmin()) {
      this.songService.getWaitingTime().subscribe(
        data => this.waitingTimeInput.nativeElement.value = data.json().value
      );
    }

  }

  onSaveClick() {
    localStorage.setItem("baseUrl", this.baseUrlInput.nativeElement.value);

    if (this.waitingTimeInput.nativeElement.value) {
      this.songService.setWaitingTime(this.waitingTimeInput.nativeElement.value).subscribe();
    }
    this.router.navigateByUrl('/');
  }

}
