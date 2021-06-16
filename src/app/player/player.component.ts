import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  OnDestroy,
  OnInit,
  ViewChild
} from '@angular/core';
import {PlayerService} from "../core/services/player.service";
import {Subscription} from "rxjs";
import {EPlayerStates} from "../core/enums/EPlayerStates";
import {ISong} from "../core/Interfaces/ISong";

@Component({
  selector: 'app-player',
  templateUrl: './player.component.html',
  styleUrls: ['./player.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class PlayerComponent implements OnInit, OnDestroy {
  videoID: string ='';
  apiLoaded = false;
  isPlaying: boolean = false;
  playerInstance: any;
  playerParameters: any = {
    autoplay: 1,
    controls: 0
  };
  @ViewChild('player') player: any;
  private subscriptions: Subscription[] = [];

  private set sub(sub: Subscription) {
    this.subscriptions.push(sub);
  }
  constructor( public cdr: ChangeDetectorRef,
               public playerService: PlayerService) { }

  ngOnInit() {
    this.sub = this.playerService.playSong.subscribe(song => this.setNewSongToPlay(song));
    this.sub = this.playerService.playListHasChanged.subscribe(_=> {
      if (!this.isPlaying){
        this.initPlayer()
      }
    });
  }

  private initPlayer() {
    this.playFirstSongOnList();
    this.loadPlayer();
    this.cdr.markForCheck();
  }

  private loadPlayer(){
    console.log('loadPlayer', this.apiLoaded)
    if (!this.apiLoaded) {
      const tag = document.createElement('script');
      tag.src = 'https://www.youtube.com/iframe_api';
      document.body.appendChild(tag);
      this.apiLoaded = true;
    }
  }

  private playFirstSongOnList(){
    if(this.playerService.playlist.length > 0){
      this.setNewSongToPlay(this.playerService.playlist[0]);
      if(!this.isPlaying && this.apiLoaded){
        this.isPlaying = true;
        this.playerInstance.playVideo();
      }
    }
  }

  private setNewSongToPlay(song: ISong) {
    this.playerService.currentSong = song;
    this.videoID = this.playerService.extractVideoIDFromURL(song.url);
   this.player.videoId = this.videoID;
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach(sub => sub.unsubscribe());
  }

  onStateChanged(event: any) {
    if(event.data === EPlayerStates.Ended) {
      this.isPlaying = false;
      this.playerService.removeCurrentSongPromPlaylist();
    }
  }

  onPlayerIsReady(event: YT.PlayerEvent) {
    event.target.mute();
    //browser won't automatically start play video with voice, so i have to find such workaround to start the video muted and than unmute it
    setTimeout(()=> {
      event.target.playVideo();
      event.target.unMute()},
      0);
    this.playerInstance = event.target;
    this.isPlaying = true;
  }
}
