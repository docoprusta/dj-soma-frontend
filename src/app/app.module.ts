import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HttpModule } from '@angular/http';
import { SocketIoModule, SocketIoConfig } from 'ngx-socket-io';

import { Ng4LoadingSpinnerModule } from 'ng4-loading-spinner';

import { AppComponent } from './app.component';
import { NavbarComponent } from './navbar/navbar.component';
import { AppRoutingModule } from './/app-routing.module';
import { PlaylistComponent } from './playlist/playlist.component';
import { SearchComponent } from './search/search.component';
import { SongService } from './services/song.service';
import { YoutubeService } from './services/youtube.service';
import { MinuteSecondsPipe } from './minute-seconds.pipe';

const config: SocketIoConfig = { url: 'http://localhost:5000', options: {} };

@NgModule({
  declarations: [
    AppComponent,
    NavbarComponent,
    PlaylistComponent,
    SearchComponent,
    MinuteSecondsPipe
  ],
  imports: [
    BrowserModule,
    HttpModule,
    AppRoutingModule,
    Ng4LoadingSpinnerModule.forRoot(),
    SocketIoModule.forRoot(config)
  ],
  providers: [
    SongService,
    YoutubeService,
    MinuteSecondsPipe
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
