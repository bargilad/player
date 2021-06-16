import {ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit} from '@angular/core';
import {PlayerService} from './core/services/player.service';
import {EMessageTypes} from "./core/enums/EMessageTypes";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AppComponent implements OnInit{
  constructor(public playerService: PlayerService,
              public cdr: ChangeDetectorRef){}

  ngOnInit(): void {
    this.playerService.socket.subscribe(value => {
      this.playerService.playlist = value.songs;
      if (value.requestType !== EMessageTypes[EMessageTypes.ReplaceList]){
        this.playerService.playListHasChanged.next();
      }
      this.cdr.markForCheck();
    });
  }
}
