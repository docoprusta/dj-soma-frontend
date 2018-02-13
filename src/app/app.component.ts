import { Component } from '@angular/core';
import { Http } from '@angular/http';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'app';

  titles = [];
  videoIds = [];
  images = [];

  baseUrl = "http://127.0.0.1:5000?video=";

  cache = [];

  videoUrl :string;

  constructor(private http: Http) { }

  playVideo() {
    this.http.get(this.videoUrl).subscribe((response) => console.log(response.text));
  }

  onBreadCrumbClick(index) {
    this.videoUrl = this.baseUrl + this.videoIds[index];
    this.playVideo();
  }

  onKeyUp(value: string) {
    this.titles = [];
    this.videoIds = [];
    this.images = [];

    if (value && this.cache.findIndex((item) => item.searched === value) === -1) {
      let url =
        "https://www.googleapis.com/youtube/v3/search";
      this.http.get(url, {
        params: {
          q: value,
          part: "snippet",
          key: "AIzaSyDnXC_k6YB-A8H4GC3swaqO7lzFXPQGjTQ"
        }
      })
        .toPromise()
        .then(response => {

          response.json().items.forEach(element => {
            if (element.snippet.title !== undefined && element.id.videoId !== undefined && element.snippet.thumbnails.medium.url != undefined) {
              this.titles.push(element.snippet.title + '\n');
              this.videoIds.push(element.id.videoId + '\n');
              this.images.push(element.snippet.thumbnails.medium.url + '\n');
            }
          });

          this.cache.push({ "searched": value, "titles": this.titles, "videoIds": this.videoIds, "images": this.images });
        })
        .catch(console.log);
    } else if(value) {
      const searchedItem = this.cache.find((item) => item.searched === value)
      this.titles = searchedItem.titles;
      this.videoIds = searchedItem.videoIds;
      this.images = searchedItem.images;
    }
  }
}
