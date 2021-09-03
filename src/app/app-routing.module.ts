import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { ReadComponent } from './components/read/read.component';
import { CreateComponent } from './components/create/create.component';

const routes: Routes = [
  {
    path: 'read/:section', 
    component: ReadComponent
  },
  {
    path: 'delete/:section', 
    component: ReadComponent
  },
  {
    path: 'create/:section',
    component: CreateComponent,
  }
]

@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    RouterModule.forRoot(routes)
  ],
  exports: [
    RouterModule
  ]
})
export class AppRoutingModule { }
