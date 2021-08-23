import {
  Component,
} from '@angular/core';

@Component({
  selector: 'dwu-bar-chart-demo',
  templateUrl: './bar-chart-demo.component.html',
  styleUrls: ['./bar-chart-demo.component.scss'],
})
export class BarChartDemoComponent {
  public demoData;
  public demoKeys = [
    'dogs',
    'cats',
  ];
  public hoverIndex: number;
  public barChartHtml: string = barChartHtml;
  public barChartJs = '';

  constructor() {
    this.generateDemoData();
  }

  public generateDemoData() {
    const now = Date.now();
    this.demoData = [];
    const period = 1000 * 60 * 60 * 24;
    for (let i = 0; i < 7; i++) {
      this.demoData.push({
        timestamp: now - (i * period),
        dogs: Math.floor(Math.random() * 10) + 10,
        cats: Math.floor(Math.random() * 10) + 20,
      });
    }
    this.generateSnippets();
  }

  public generateSnippets() {
    this.barChartJs = `this.demoKeys = ${JSON.stringify(this.demoKeys, null, 2)};\nthis.demoData = ${JSON.stringify(this.demoData, null, 2)};`;
  }
}

const barChartHtml =
`<dwu-bar-chart
  [tableData]="demoData"
  [keys]="demoKeys"
  [hoverIndex]="hoverIndex"
  (hoverIndexChange)="hoverIndex = $event"
></dwu-bar-chart>`;

