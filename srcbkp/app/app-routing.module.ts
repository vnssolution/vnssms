import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';


const routes: Routes = [];

@NgModule({
  imports: [RouterModule.forRoot(routes,{ useHash: false,enableTracing: true })],
  exports: [RouterModule]
})
export class AppRoutingModule { }
