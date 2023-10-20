import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DataGraphComponent } from './data-graph/data-graph.component';
import { NgxChartsModule } from '@swimlane/ngx-charts';



@NgModule({
  declarations: [
    DataGraphComponent
  ],
  imports: [
    CommonModule,
    NgxChartsModule
  ],
  exports:[
    DataGraphComponent
  ]
})
export class GraphModule { }
