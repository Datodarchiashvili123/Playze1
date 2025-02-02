import {Routes} from '@angular/router';
import {HomeComponent} from "./pages/home/home.component";

export const routes: Routes = [

    {path: '', component: HomeComponent},
    {
        path: 'games',
        loadComponent: () =>
            import('./pages/games/games.component').then((m) => m.GamesComponent),
    },

    {
        path: 'games/:id',
        loadComponent: () =>
            import('./pages/game-details/game-details.component').then((m) => m.GameDetailsComponent),
    },
    {
        path: 'news',
        loadComponent: () =>
            import('./pages/news/news.component').then((m) => m.NewsComponent),
    },
    {
        path: 'news/:id',
        loadComponent: () =>
            import('./pages/news-details/news-details.component').then((m) => m.NewsDetailsComponent),
    },
    {
        path: '**',
        component: HomeComponent,
    }

];
