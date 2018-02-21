import { Observable } from "rxjs/Observable";
import { Song } from "../models/song";
import { of } from 'rxjs/observable/of';
import { catchError, map, tap } from 'rxjs/operators';
import { Http } from "@angular/http";
import { Injectable } from "@angular/core";
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/debounceTime';
import 'rxjs/add/operator/distinctUntilChanged';
import 'rxjs/add/operator/switchMap';


@Injectable()
export class YoutubeService {

    public videoIds = [];
    public images = [];
    public titles = [];

    private cache = [];

    inputString: string;

    constructor(private http: Http) { }

    search(terms: Observable<string>) {
        return terms.debounceTime(400)
            .distinctUntilChanged()
            .switchMap(term => this.searchSongs(term));
    }

    searchSongs(term: string) {
        this.inputString = term;
        let url = "https://www.googleapis.com/youtube/v3/search";
        return this.http
            .get(url, {
                params: {
                    q: term,
                    part: "snippet",
                    maxResults: 10,
                    key: "AIzaSyDnXC_k6YB-A8H4GC3swaqO7lzFXPQGjTQ"
                }
            })
    }

    populateResults(results): void {
        this.clearEveryArray();

        if (this.inputString && !this.isCached()) {
            this.populateEveryArray(results);
            this.addResultsToCache();
        } else if (this.inputString) {
            const itemFromCache = this.cache.find((item) => item.searched === this.inputString)
            this.removeDuplicatesFromEveryArray(itemFromCache);
        }
    }

    populateEveryArray(results) {
        results.items.forEach(element => {
            if (this.isResultContainsEveryData(element)) {
                this.titles.push(element.snippet.title + '\n');
                this.videoIds.push(element.id.videoId + '\n');
                this.images.push(element.snippet.thumbnails.medium.url + '\n');
            }
        });
    }

    addResultsToCache(): void {
        this.cache.push({
            "searched": this.inputString,
            "titles": this.titles,
            "videoIds": this.videoIds,
            "images": this.images
        });
    }

    isCached(): boolean {
        return this.cache.findIndex((item) => item.searched === this.inputString) !== -1;
    }

    isResultContainsEveryData(element): boolean {
        return element.snippet.title !== undefined &&
            element.id.videoId !== undefined &&
            element.snippet.thumbnails.medium.url != undefined;
    }

    removeDuplicatesFromEveryArray(itemFromCache) {
        this.titles = this.removeDuplicatesFromArray(itemFromCache.titles);
        this.videoIds = this.removeDuplicatesFromArray(itemFromCache.videoIds);
        this.images = this.removeDuplicatesFromArray(itemFromCache.images);
    }

    removeDuplicatesFromArray(array: Array<any>) {
        return array.filter((item, index, array) => array.indexOf(item) == index);
    }

    clearEveryArray(): void {
        this.titles = [];
        this.videoIds = [];
        this.images = [];
    }
}