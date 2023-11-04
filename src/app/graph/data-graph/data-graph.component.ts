import { Component, Input, OnChanges } from '@angular/core';
import { Color, ScaleType } from '@swimlane/ngx-charts';
import DataCalculate from 'src/app/interface/datacalculate.interface';
import { ISeries, Idata } from 'src/app/models/data.interface';
import { FirebaseService } from 'src/app/services/firebase.service';

@Component({
  selector: 'app-data-graph',
  templateUrl: './data-graph.component.html',
  styleUrls: ['./data-graph.component.css']
})
export class DataGraphComponent implements OnChanges{
  public data: Idata[] = [];
  public dataArray: ISeries[] = [];
  view: [number, number] = [1100, 500];
  //public getDataFirebase: DataCalculate[] = [];

  // options
  legend: boolean = true;
  showLabels: boolean = true;
  animations: boolean = true;
  xAxis: boolean = true;
  yAxis: boolean = true;
  showYAxisLabel: boolean = true;
  showXAxisLabel: boolean = true;
  xAxisLabel: string = 'Fecha';
  yAxisLabel: string = 'Valor medalla';
  timeline: boolean = true;

  colorScheme: Color = {
    name: 'myScheme',
    selectable: true,
    group: ScaleType.Ordinal,
    domain: ['#F4CC25', '#7da555', '#FFFFF'],
  };


  @Input() getDataFirebase: any;
  @Input() getDataFirebaseFilter: any;

  constructor() {}

  ngOnChanges() {
    if (this.getDataFirebase) 
      this.createObject();
  }

  createObject() {
    this.dataArray = [];
    this.getDataFirebaseFilter.forEach((element: DataCalculate) => {
      let dataSeries: ISeries = {
        value: element.vlMedalIncrement,
        name: element.dateCurrent
      }

      this.dataArray.push(dataSeries);
    });
    this.dataArray = this.sortData();

    let dataCalculate: Idata =
    {
      name: 'Matrix',
      series: this.dataArray
    }

    let dataAll: Idata[] = [];
    dataAll.push(dataCalculate);

    this.data = dataAll;
  }

  sortData() {
    return this.dataArray.sort(this.orderbyDate);
  }

  orderbyDate(a: ISeries, b: ISeries) {
    return a.name > b.name ? 1 : -1;
  }

}
