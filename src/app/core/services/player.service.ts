import {Injectable} from '@angular/core';
import {ISong} from '../Interfaces/ISong';
import {Observable, Subject} from "rxjs";
import {HttpClient} from "@angular/common/http";
import * as moment_ from 'moment';
import {tap} from "rxjs/operators";
import {webSocket, WebSocketSubject} from "rxjs/webSocket";
import {EMessageTypes} from "../enums/EMessageTypes";
const moment = moment_;

@Injectable({
  providedIn: 'root'
})
export class PlayerService {
  playlist: ISong[] = [];
  currentSong: ISong = {name: '', url: '', id: -1, duration: ''};
  playSong: Subject<ISong> = new Subject<ISong>();
  playListHasChanged: Subject<void> = new Subject<void>();
  public socket: WebSocketSubject<any> = webSocket('ws://localhost:3001');
  private youtubeAPIKey = 'AIzaSyDSvTFsGUh-iK0_FW6zQEfXrY7vK6yJqW8';

  constructor(private http: HttpClient) { }

  addSongToPlaylist(songUrl: string): Observable<any>{
    const songID = this.extractVideoIDFromURL(songUrl);
    const youtubeAPIURL =  `https://www.googleapis.com/youtube/v3/videos?id=${songID}&key=${this.youtubeAPIKey}&part=snippet,contentDetails`;
    return this.http.get(youtubeAPIURL).pipe(
      tap((output: any) => {
        this.addSongWithDetailsToPlaylist(output, songUrl);
      })
    );
  }

  public sendMessageToBE(message: any) {
    return this.socket.next(message);
  }

  private addSongWithDetailsToPlaylist(songDetails : any, songUrl: string): void{
    const duration = moment.utc(moment.duration(songDetails.items[0].contentDetails.duration).asMilliseconds()).format('mm:ss');
    const title = songDetails.items[0].snippet.title;
    this.sendMessageToBE({type: EMessageTypes[EMessageTypes.AddSong], data:
        {name: title, url: songUrl, duration: duration}
    });
  }

  removeCurrentSongPromPlaylist(): void{
    return this.removeSpecificSongPromPlaylist(this.currentSong)
  }

  removeSpecificSongPromPlaylist(song: ISong): void{
    this.sendMessageToBE({type: EMessageTypes[EMessageTypes.RemoveSong], data: song});
  }

  extractVideoIDFromURL(url: string) : string{
    return url.split('watch?v=')[1];
  }

  replacePlaylist(playlistSongs: ISong[]) : void{
    this.sendMessageToBE({type: EMessageTypes[EMessageTypes.ReplaceList], data: playlistSongs});
  }
}
