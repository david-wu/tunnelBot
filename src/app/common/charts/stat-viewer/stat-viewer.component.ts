import {
    Component,
    Input,
} from '@angular/core';
import { round } from 'lodash';

@Component({
  selector: 'dwu-stat-viewer',
  templateUrl: './stat-viewer.component.html',
  styleUrls: ['./stat-viewer.component.scss'],
})
export class StatViewerComponent {

    @Input() columnData: any;
    @Input() keys: string[];
    @Input() disabledKeys: Set<string> = new Set();
    @Input() labelsByKey: Record<string, string>;
    @Input() rowCount = 2;
    @Input() formattersByKeys: Record<string, Function> = {};
    @Input() hoverSeries: string;

    public statTable = [];

    public ngOnChanges(changes) {
        if (changes.columnData || changes.keys) {
            if (this.columnData && this.keys) {
                this.buildStatTable();
            }
        }
    }

    public buildStatTable() {
        this.statTable = [];
        const keys = [...this.keys];
        while (keys.length) {
            const columnKeys = keys.splice(0, this.rowCount);
            const columnValues = columnKeys.map((columnKey: string) => {
                const cellValue = this.columnData[columnKey];
                if (this.formattersByKeys[columnKey]) {
                    return this.formattersByKeys[columnKey](cellValue);
                }
                if (typeof cellValue === 'number') {
                    return round(cellValue, 2).toLocaleString();
                } else {
                    return cellValue;
                }
            });
            this.statTable.push({
                columnKeys,
                columnValues,
            });
        }
    }

    public getFormattedValue(key: string) {
      const formatter = this.formattersByKeys[key];
      const unformattedValue = this.columnData[key];
      if (formatter) {
        return formatter(unformattedValue);
      }
      if (typeof unformattedValue === 'number') {
        return round(unformattedValue, 2).toLocaleString();
      }
      return unformattedValue;
    }

    public isFocused(key: string): boolean {
      return !this.hoverSeries || (this.hoverSeries === key);
    }

}
