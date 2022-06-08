import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AlertComponent } from './alert/alert.component';
import { LoadingspinnerComponent } from './loadingspinner/loadingspinner.component';
import { DropdownDirective } from './dropdown.directive';



@NgModule({
  declarations: [
    AlertComponent,
    LoadingspinnerComponent,
    DropdownDirective
  ],
  imports: [
    CommonModule
  ],

  exports:[
    AlertComponent,
    LoadingspinnerComponent,
    DropdownDirective,
    CommonModule
  ]
})
export class SharedModule { }
