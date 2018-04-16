/**
 * @license
 * Copyright © 2017-2018 OSIsoft, LLC. All rights reserved.
 * Use of this source code is governed by the terms in the accompanying LICENSE file.
 */
import { Component, Input, OnChanges, ElementRef, ChangeDetectionStrategy, Inject } from '@angular/core';
import { ContextMenuAPI, CONTEXT_MENU_TOKEN } from '../framework';
import Chart from 'chart.js'

@Component({
  selector: 'my-chart',
  templateUrl: 'my-chart.component.html',
  styleUrls: ['my-chart.component.css']
})
export class MyChartComponent implements OnChanges {
  @Input() bgColor: string;
  @Input() data: any;
  @Input() chartType: string;
  @Input() title: string;
  private myChart;
  private averageOn: boolean;

  constructor(private elRef: ElementRef, @Inject(CONTEXT_MENU_TOKEN) private contextMenu: ContextMenuAPI) {
    this.averageOn = false;
    contextMenu.onSelect('toggle-average').subscribe(cmd => {
      this.toggleAverage();
      this.myChart.update();
    });
  }

  private initChart(chartType: string) {
    var ctx = this.elRef.nativeElement.querySelector('canvas');
    if (this.myChart)     {
        this.myChart.destroy();
    }

    this.myChart = new Chart(ctx, {
      type: chartType,
      options: {
        title: {
          display: true,
          text: this.title
        },
        maintainAspectRation: false
      }
    });
  }

  private updateChartData(data) {
    if (this.myChart && data.body.headers && data.body.events) {
      let resetAverage = false;
      if (this.averageOn) {
        resetAverage = true;
        this.toggleAverage()
      }

      let chartData = this.myChart.data;
      let headers = data.body.headers.slice(1);
      for (let i = 0; i < headers.length; i++) {
        if (chartData.labels.length <= i) {
          chartData.labels.push(headers[i]);
        } 
        else {
          chartData.labels[i] = headers[i];
        }
      }

      let colorHelper = Chart.helpers.color;
      for (let i = 0; i < data.body.events.length; i++) {
        // Series name
        let splits = data.body.events[i][0].split('\\');
        let color = data.body.items[i].color;
        let update =  {
          label: splits[splits.length - 1],
          data: data.body.events[i].slice(1),
          backgroundColor: this.chartType === 'radar' ? colorHelper(color).alpha(0.2).rgbString() : color,
          borderColor: color,
          pointBackgroundColor: color,
          pointBorderColor: color
        };
        
        if (chartData.datasets.length <= i) {
          chartData.datasets.push(update);
        }
        else {
          chartData.datasets[i].data = data.body.events[i].slice(1);
        }
      }

      if (resetAverage)
        this.toggleAverage();
    }
  }

  private updateOptions(changeObj) {
    if (this.myChart) {
      this.myChart.options = Object.assign(this.myChart.options, changeObj);
    }
  }

  private toggleAverage() {
    this.averageOn = !this.averageOn;
    let chartData = this.myChart.data;
    if (this.averageOn) {
      let data = [];
      chartData.datasets.forEach(function(series) {
        if (!data.length) {
          data = series.data.slice(0);
        }
        else {
          data = data.map((num, index) => {
            return num + series.data[index];
          });
        }
      });

      data = data.map(function (num, index) {
        return num / chartData.datasets.length
      });

        let colorHelper = Chart.helpers.color;
        let color = '#00FF00';
        let update =  {
          label: 'Average',
          data: data,
          backgroundColor: this.chartType === 'radar' ? colorHelper(color).alpha(0.2).rgbString() : color,
          borderColor: color,
          pointBackgroundColor: color,
          pointBorderColor: color
        };

        chartData.datasets.push(update);
    }
    else {
        let indexAverage = -1;
        for (let i = 0; i < chartData.datasets.length; i++) {
          if (chartData.datasets[i].label === 'Average') {
            indexAverage = i;
            break;
          }
        }
        if (indexAverage >= 0) {
          chartData.datasets.spice(indexAverage, 1)
        }
    }
  }

  ngOnChanges(changes) {
    if (changes.chartType) {
      this.initChart(this.chartType);
      this.updateChartData(this.data);
    }
    if (changes.data) {      
      this.updateChartData(this.data);
    }
    if (changes.title) {
      this.updateOptions({ title: {
          display: true,
          text: this.title
      }});
    }

    this.myChart.update();
  } 
}
