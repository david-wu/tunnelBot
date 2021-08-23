import { NgModule } from '@angular/core';
import { NoPreloading, RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: 'about-me',
    loadChildren: () => import('./about-me/about-me.module').then(m => m.AboutMeModule)
  },
  {
    path: 'portfolio',
    loadChildren: () => import('./portfolio/portfolio.module').then(m => m.PortfolioModule)
  },
  {
    path: 'corona',
    loadChildren: () => import('./corona/corona.module').then(m => m.CoronaModule)
  },
  {
    path: 'poe',
    loadChildren: () => import('./poe/poe.module').then(m => m.PoeModule)
  },
  {
    path: 'photos',
    loadChildren: () => import('./photo-gallery/photo-gallery.module').then(m => m.PhotoGalleryModule)
  },
  {
    path: 'ml-app',
    loadChildren: () => import('./ml-app/ml-app.module').then(m => m.MlAppModule)
  },
  {
    path: 'image-sources',
    loadChildren: () => import('./picture-piper/image-sources/image-sources.module').then(m => m.ImageSourcesModule)
  },
  {
    path: 'pp',
    loadChildren: () => import('./picture-piper/picture-piper.module').then(m => m.PicturePiperModule)
  },
  {
    path: 'pp-test-app',
    loadChildren: () => import('./pp-test-app/pp-test-app.module').then(m => m.PpTestAppModule)
  },
  {
    path: '',
    pathMatch: 'full',
    redirectTo: 'portfolio'
  },
];

@NgModule({
  imports: [
      RouterModule.forRoot(
        routes,
        {
          useHash: true,
          preloadingStrategy: NoPreloading,
        },
      ),
  ],
  exports: [RouterModule],
})
export class AppRoutingModule { }
