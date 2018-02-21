import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PlaylistComponent } from './playlist/playlist.component';
import { SearchComponent } from './search/search.component';


const routes: Routes = [
  { path : '', redirectTo: 'search', pathMatch: 'full'},
  { path: 'playlist', component: PlaylistComponent },
  { path: 'search', component: SearchComponent }
]

@NgModule({
  exports: [
    RouterModule
  ],
  imports: [RouterModule.forRoot(routes)]
})

export class AppRoutingModule { }
