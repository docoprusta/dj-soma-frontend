import { Song } from '../models/song';
import { Http, Request, RequestOptions } from '@angular/http';
import { Injectable } from '@angular/core';

import { Socket } from 'ngx-socket-io';
import { delay } from 'rxjs/operators';
import { Observable } from 'rxjs/Observable';
import { YoutubeService } from './youtube.service';

@Injectable()
export class SongService {
    public songs: Array<Song> = new Array<Song>();

    private readonly baseUrl: string = localStorage.getItem("baseUrl");
    private readonly songRoute: string = "/song";
    private readonly playlistRoute: string = "/playlist";
    private readonly volumeRoute: string = "/volume";
    private readonly autoPlayRoute: string = "/autoplay";
    private readonly waitingTimeRoute: string = "/waiting-time";
    private readonly nextSongRoute: string = "/next-song";
   
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

    public autoPlay: boolean;

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

    isAdmin() {
        return localStorage.getItem("baseUrl").includes("127.0.0.1");
    }

    getTimePos() {
        this.socket.on("timePosChanged", data => {
            this.progress = data
        });
    }

    getRemainingTime() {
        this.socket.on("remainingTimeChanged", data => {
            if (data > 0) {
                this.remainingTime = data;
            }
        });
    }

    getWaitingTimeChanged(): Observable<string> {
        return this.socket.fromEvent("waitingTimeChanged");
    }

    getSongDeleted(): Observable<string> {
        return this.socket.fromEvent("songDeleted");
    }

    getNextSongAdded(): Observable<string> {
        return this.socket.fromEvent("nextSongAdded");
    }

    setWaitingTime(waitingTime: number) {
        return this.http.put(this.baseUrl + this.waitingTimeRoute, { "value": waitingTime });
    }

    getWaitingTime() {
        return this.http.get(this.baseUrl + this.waitingTimeRoute);
    }

    getNextSong() {
        return this.http.get(this.baseUrl + this.nextSongRoute);
    }

    getAutoplayChanged() {
        return this.socket.fromEvent("autoplayChanged");
    }

    songAdded(): Observable<string> {
        return this.socket.fromEvent("songAdded");
    }

    volumeChanged(): Observable<string> {
        return this.socket.fromEvent("volumeChanged");
    }

    songEnded() {
        return this.socket.fromEvent("songEnded");
    }

    postSong(song: Song) {
        return this.http.post(this.baseUrl + this.songRoute, song);
    }

    deleteSong(youtubeId: string) {
        return this.http.delete(this.baseUrl + this.songRoute,
            new RequestOptions({ body: { "youtubeId": youtubeId } }));
    }

    getPlaylist() {
        return this.http.get(this.baseUrl + this.playlistRoute);
    }

    getVolume() {
        return this.http.get(this.baseUrl + this.volumeRoute);
    }

    setVolume(volume: number) {
        return this.http.put(this.baseUrl + this.volumeRoute, { "value": volume });
    }

    setAutoPlay(autoPlay: boolean) {
        return this.http.put(this.baseUrl + this.autoPlayRoute, { "value": autoPlay });
    }

    getAutoPlay() {
        return this.http.get(this.baseUrl + this.autoPlayRoute);
    }

}