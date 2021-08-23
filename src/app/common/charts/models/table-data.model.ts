import { mapValues } from 'lodash';

export class TableData {

  public data = [];

  constructor(options: Partial<TableData>) {
    Object.assign(this, options);
  }

  public addNormalizedFields(normalizeMap: Record<string, Function>) {
    const normalizedData = this.data.forEach((tableDatum) => {
      const normalValues = mapValues(normalizeMap, (normalizer, key) => normalizer(tableDatum));
      return Object.assign(tableDatum, normalValues);
    });
  }
}