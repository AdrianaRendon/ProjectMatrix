import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CalculateComponent } from './calculate/calculate.component';
import { FormsModule } from '@angular/forms';

@NgModule({
  declarations: [
    CalculateComponent
  ],
  imports: [
    CommonModule,
    FormsModule
  ],
  exports:[
    CalculateComponent
  ]
})
export class TablesModule { }
