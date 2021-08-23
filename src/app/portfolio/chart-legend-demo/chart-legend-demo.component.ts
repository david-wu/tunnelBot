import {
  Component,
} from '@angular/core';

@Component({
  selector: 'dwu-chart-legend-demo',
  templateUrl: './chart-legend-demo.component.html',
  styleUrls: ['./chart-legend-demo.component.scss'],
})
export class ChartLegendDemoComponent {
  public keys = [
    'key1',
    'key2',
    'key3',
  ];
  public colorsByKey = {
    key1: '#B24C63',
    key2: '#5438DC',
    key3: '#357DED',
  };
  public disabledKeys = new Set();
  public labelsByKey = {
    key1: 'Key 1',
    key2: 'Key 2',
    key3: 'Key 3',
  };

  public htmlSnippet = htmlSnippet;
  public codeSnippet = codeSnippet;
}


const htmlSnippet =
`<dwu-chart-legend
  [keys]="keys"
  [colorsByKey]="colorsByKey"
  [labelsByKey]="labelsByKey"
  [disabledKeys]="disabledKeys"
  (disabledKeysChange)="onDisabledKeysChange($event)"
></dwu-chart-legend>`;

const codeSnippet =
`public keys = [
  'key1',
  'key2',
  'key3',
];
public colorsByKey = {
  key1: '#B24C63',
  key2: '#5438DC',
  key3: '#357DED',
};
public disabledKeys = new Set();
public labelsByKey = {
  key1: 'Key 1',
  key2: 'Key 2',
  key3: 'Key 3',
};`;
