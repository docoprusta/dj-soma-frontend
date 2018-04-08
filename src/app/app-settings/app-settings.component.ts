import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-app-settings',
  templateUrl: './app-settings.component.html',
  styleUrls: ['./app-settings.component.css']
})
export class AppSettingsComponent implements OnInit {
  @ViewChild("baseUrlInput") baseUrlInput: ElementRef;
  public baseUrl: string;

  constructor(private router: Router) { }

  ngOnInit() {
    this.baseUrlInput.nativeElement.value = localStorage.getItem("baseUrl");
  }

  onSaveClick() {
    localStorage.setItem("baseUrl", this.baseUrlInput.nativeElement.value);
    this.router.navigateByUrl('/');
  }

}
