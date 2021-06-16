import {ChangeDetectionStrategy, Component, OnInit} from '@angular/core';
import {PlayerService} from "../../core/services/player.service";

@Component({
  selector: 'app-search-box',
  templateUrl: './search-box.component.html',
  styleUrls: ['./search-box.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SearchBoxComponent implements OnInit {
  songURL: string = '';

  constructor(public playerService: PlayerService) { }

  ngOnInit(): void {
  }

  addSongToPlaylist() {
    this.playerService.addSongToPlaylist(this.songURL).subscribe(_=>this.songURL = '');
  }
}
