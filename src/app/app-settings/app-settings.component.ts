import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-app-settings',
  templateUrl: './app-settings.component.html',
  styleUrls: ['./app-settings.component.css']
})
export class AppSettingsComponent implements OnInit {
  @ViewChild("baseUrlInput") baseUrlInput: ElementRef;
  @ViewChild("waitingTimeInput") waitingTimeInput: ElementRef;
  public baseUrl: string;

  constructor(private router: Router) { }

  ngOnInit() {
    this.baseUrlInput.nativeElement.value = localStorage.getItem("baseUrl");
    this.waitingTimeInput.nativeElement.value = localStorage.getItem("waitingTime");
  }

  onSaveClick() {
    localStorage.setItem("baseUrl", this.baseUrlInput.nativeElement.value);
    localStorage.setItem("waitingTime", this.waitingTimeInput.nativeElement.value);
    this.router.navigateByUrl('/');
  }

}
