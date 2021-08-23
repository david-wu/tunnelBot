
import { groupBy, mapValues } from 'lodash';
import { TableData } from './table-data.model';

export class ChartData {

  // public static getDateGroupBy(timestampAttr: string = 'timestamp') {
  //   return (tableData: any) => {
  //     const timestamp = tableData[timestampAttr];
  //     return new Date(timestamp).toLocaleDateString();
  //   }
  // }

  // public static normalizeTableData(tableData, normalizeMap: Record<string, Function>) {
  //   const normalizedData = tableData.map((tableDatum) => {
  //     const normalValues = mapValues(normalizeMap, (normalizer, key) => normalizer(tableDatum));
  //     return {
  //       ...tableData,
  //       ...normalValues,
  //     };
  //   });
  // }

  public static fromTableData(tableData: TableData, groupBys = [], filters = []) {
    if (!groupBys.length) {
      return new ChartData({
        data: tableData,
        groupBys: groupBys,
        filters: filters,
      });
    }
    const groupedData = groupBy(tableData.data, groupBys[0]);

    return new ChartData({
      data: tableData,
      groupBys: groupBys,
      filters: filters,
      series: mapValues(groupedData, (values, key) => {
        const nextTd = new TableData({ data: values });
        const nextGroupBys = groupBys.slice(1);
        const nextFilters = [
          ...filters,
          {
            attr: groupBys[0],
            condition: '=',
            value: key,
          },
        ];
        return ChartData.fromTableData(nextTd, nextGroupBys, nextFilters)
      }),
    });
  }

  public series: any = {};
  public counters = [];
  public groupBys = [];
  public data: TableData;
  public filters = [];

  constructor(options: Partial<ChartData>) {
    Object.assign(this, options);
  }
}



const td = new TableData({
  data: [
    {
      timestamp: Date.now()-(2*24*60*60*1000),
      weight: 195,
      name: 'David',
    },
    {
      timestamp: Date.now()-(2*24*60*60*1000),
      weight: 123,
      name: 'Joanna',
    },
    {
      timestamp: Date.now()-(1*24*60*60*1000),
      weight: 199,
      name: 'David',
    },
    {
      timestamp: Date.now()-(1*24*60*60*1000),
      weight: 122,
      name: 'Joanna',
    },
    {
      timestamp: Date.now()-(0*24*60*60*1000),
      weight: 198,
      name: 'David',
    },
    {
      timestamp: Date.now()-(0*24*60*60*1000),
      weight: 121,
      name: 'Joanna',
    },
  ],
});
td.addNormalizedFields({
  dateStr: (d) => new Date(d.timestamp).toLocaleDateString(),
})
console.log('td', td)
const groupBys = [
  // (data: any) => data.name,
  'name',
  'dateStr'
  // ChartData.getDateGroupBy(),
  // (data: any) => data.weight,
];
// ChartData.normalizeTableData(td, {
//   dateStr: (d) => new Date(d.timestamp).toLocaleDateString(),
// })
const data = ChartData.fromTableData(td, groupBys);
console.log('data', data)