import { Song } from '../models/song';
import { Http } from '@angular/http';
import { Injectable } from '@angular/core';

import { Socket } from 'ngx-socket-io';
import { delay } from 'rxjs/operators';
import { Observable } from 'rxjs/Observable';
import { YoutubeService } from './youtube.service';

@Injectable()
export class SongService {
    public songs: Array<Song> = new Array<Song>();

    private baseUrl: string = localStorage.getItem("baseUrl");
    private songRoute: string = "/song";
    private playlistRoute: string = "/playlist";

    public alreadyAdded: boolean = false;

    public isFirst: boolean = true;

    public videoIds = [];
    public images = [];
    public titles = [];
    public durations = [];
    public canAddNewSong: boolean = true;

    public progress: number;

    public newSong: Song;

    public remainingTime: number = 0;

    constructor(
        private http: Http,
        private socket: Socket,
        private youtubeService: YoutubeService) { }

    sendPostSong(index: number) {
        this.newSong = new Song(
            this.youtubeService.titles[index],
            this.youtubeService.videoIds[index],
            this.youtubeService.images[index],
            this.youtubeService.durations[index]
        );
        this.postSong(this.newSong).subscribe(
            data => {
                console.log(data);
                this.canAddNewSong = true;
            },
            error => {
                if (error.status == 409) {
                    this.alreadyAdded = true;
                } else if (error.status == 429) {
                    this.canAddNewSong = false;
                }
            }
        );
    }

    sendJoined() {
        this.socket.emit("joined");
    }

    getTimePos() {
        this.socket.on("timePosChanged", data => this.progress = data);
    }

    getRemainingTime() {
        this.socket.on("remainingTimeChanged", data => {
            if (data > 0) {
                this.remainingTime = data;
            }
        });
    }

    songAdded(): Observable<string> {
        return this.socket.fromEvent("songAdded");
    }

    songEnded() {
        return this.socket.fromEvent("songEnded");
    }

    postSong(song: Song) {
        return this.http.post(this.baseUrl + this.songRoute, song);
    }

    getPlaylist() {
        return this.http.get(this.baseUrl + this.playlistRoute);
    }

}