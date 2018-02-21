import { Song } from '../models/song';
import { Http } from '@angular/http';
import { Injectable } from '@angular/core';

import { Socket } from 'ngx-socket-io';

@Injectable()
export class SongService {
    public songs: Array<Song> = new Array<Song>();

    private baseUrl: string = "http://127.0.0.1:5000";
    private songRoute: string = "/song";
    private playlistRoute: string = "/playlist";


    public progress: number;

    constructor(private http: Http, private socket: Socket) { }

    sendMessage(msg: string){
        this.socket.emit("message", msg);
    }

    getMessage() {
        this.socket.on("message", data => this.progress = data);
    }

    postSong(song: Song) {
        return this.http.post(this.baseUrl + this.songRoute, song);
    }

    getPlaylist() {
        return this.http.get(this.baseUrl + this.playlistRoute);
    }

}