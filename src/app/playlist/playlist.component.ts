import {ChangeDetectionStrategy, Component, Input} from '@angular/core';
import {ISong} from '../core/Interfaces/ISong';
import {PlayerService} from '../core/services/player.service';
import {CdkDragDrop, moveItemInArray} from "@angular/cdk/drag-drop";

@Component({
  selector: 'app-playlist',
  templateUrl: './playlist.component.html',
  styleUrls: ['./playlist.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class PlaylistComponent {
  @Input() playlistSongs: ISong[] =[];

  constructor(public playerService: PlayerService) { }

  removeSong(song: ISong) {
    this.playerService.removeSpecificSongPromPlaylist(song);
  }

  drop(event: CdkDragDrop<string[]>) {
    moveItemInArray(this.playlistSongs, event.previousIndex, event.currentIndex);
    this.playerService.replacePlaylist(this.playlistSongs);
  }

}
