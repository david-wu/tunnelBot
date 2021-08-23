import {
  Component,
  ElementRef,
  EventEmitter,
  Input,
  NgZone,
  Output,
  TemplateRef,
} from '@angular/core';
import * as d3 from 'd3';
import { first, isUndefined, last } from 'lodash';

import { TooltipService } from '@common/tooltip/tooltip.service';
import { BaseChartComponent } from '@src/app/common/charts/base-chart/base-chart.component';

@Component({
  selector: 'dwu-line-chart',
  templateUrl: './line-chart.component.html',
  styleUrls: ['./line-chart.component.scss'],
  providers: [TooltipService],
})
export class LineChartComponent extends BaseChartComponent {

  @Input() tableData: any;
  @Input() keys: string[];
  @Input() colorsByKey: Record<string, string> = {};
  @Input() colorScheme: string[] = [
    '#ED9797',
    '#AD3E3E',
    '#34A2AA',
    '#2B1919',
    '#65635F',
  ];
  @Input() disabledKeys: Set<string> = new Set();
  @Input() hoverIndex: number;
  @Output() hoverIndexChange: EventEmitter<number> = new EventEmitter<number>();
  @Input() hoverSeries: string;
  @Output() hoverSeriesChange: EventEmitter<string> = new EventEmitter<string>();
  @Input() yAxisFormatter: any;
  @Input() indicators: any[];
  @Input() xMin: number;// = Date.now() - (12*7*24*60*60*1000);
  @Input() xMax: number;

  @Input() tooltipTemplate: TemplateRef<any>;

  public filteredKeys;
  public hoverLine;
  public bubblesG;
  public maxY;

  // some extra margin on the chart itself
  public chartMargin = 12;

  constructor(
    public hostEl: ElementRef,
    public zone: NgZone,
    public tts: TooltipService,
  ) {
    super(hostEl, zone);
  }

  public ngOnChanges(changes) {
    if (changes.tableData && changes.tableData.firstChange && this.tableData) {
      this.initializeSvg();
    }
    if (changes.tableData || changes.disabledKeys || changes.xMin || changes.xMax) {
      if (this.tableData) {
        this.xMin = isUndefined(this.xMin) ? first(this.tableData).timestamp : this.xMin;
        this.xMax = isUndefined(this.xMax) ? last(this.tableData).timestamp : this.xMax;
        this.render();
      }
    }
    if (changes.hoverIndex) {
      this.positionHoverLine();
    }
    if (changes.hoverSeries) {
      this.renderHoverEffect();
    }
    if (changes.indicators) {
      this.renderIndicators(this.indicators, this.tableData, this.maxY);
    }
  }

  public ngAfterViewInit() {
    super.ngAfterViewInit();
  }

  public ngOnDestroy() {
    super.ngOnDestroy();
  }

  public initializeSvg() {
    super.initializeSvg();
    this.hoverLine = this.rootG.append('line')
      .attr('class', 'hover-line')
      .style('stroke', '#8A9A5B')
      .style('stroke-opacity', '0.8')
      .style('stroke-width', '1')
      .style('shape-rendering', 'crispEdges');
    this.bubblesG = this.rootG.append('g');
  }

  public onXYHover(x: number, y: number) {
    const numberOfXDataPoints = this.tableData && this.tableData.length;
    if (!numberOfXDataPoints) {
      return;
    }
    const xOnChart = x - this.margins.left;
    const valueOnChart = this.xScale.invert(xOnChart);
    const unboundIndex = this.getNearestIndex(this.tableData, +valueOnChart, 'timestamp');
    const hoverIndex = Math.min(Math.max(unboundIndex, 0), numberOfXDataPoints - 1);

    if (hoverIndex !== this.hoverIndex) {
      this.ngZone.run(() => {
        this.hoverIndex = hoverIndex;
        this.hoverIndexChange.emit(hoverIndex);
      });
    }

    const hoverSeries = this.findClosestSeries(hoverIndex, y);
    if (hoverSeries !== this.hoverSeries) {
      this.ngZone.run(() => {
        this.hoverSeries = hoverSeries;
        this.hoverSeriesChange.emit(hoverSeries);
      });
    }
  }

  public findClosestSeries(hoverIndex, y): string {
    y = y - this.margins.top;
    const yDomain = this.yScale.domain();
    if (y > this.yScale(yDomain[0])) {
      return;
    }

    const hoverSeries = '';
    const dataPoint = this.tableData[hoverIndex];
    const keyVals = this.keys.filter((key: string) => !this.disabledKeys.has(key))
      .map((key: string) => {
        return {
          key,
          yVal: this.yScale(dataPoint[key]),
        };
      });
    keyVals.sort((a, b) => a.yVal - b.yVal);

    let distanceFrom = Math.abs(y - keyVals[0].yVal);
    let closestSeries = keyVals[0];
    for (let i = 1; i < keyVals.length; i++) {
      const nextDistanceFrom = Math.abs(y - keyVals[i].yVal);
      if (nextDistanceFrom < distanceFrom) {
        closestSeries = keyVals[i];
        distanceFrom = nextDistanceFrom;
      }
    }

    // if mouse isn't close enough to a series
    if (distanceFrom > 12) {
      return;
    }
    return closestSeries.key;
  }

  public positionHoverLine() {
    if (!this.tableData || !this.tableData.length || (this.hoverIndex === undefined)) {
      return;
    }
    const tableColumnData = this.tableData[this.hoverIndex];
    const hoverLineTimestamp = tableColumnData.timestamp;
    const tableColumnValues = this.filteredKeys.map((key: string) => {
      if (isUndefined(tableColumnData[key])) {
        return;
      }
      return {
        value: tableColumnData[key],
        key,
      };
    }).filter(Boolean);

    this.bubblesG.attr('transform', `translate(${this.xScale(hoverLineTimestamp)},0)`);
    const bubbles = this.bubblesG.selectAll('circle.bubble')
      .data(tableColumnValues);
    bubbles.enter()
      .append('circle')
      .attr('r', 3)
      .attr('cx', 0)
      .attr('class', 'bubble')
      .style('fill', 'white')
      .attr('stroke-width', '1px')
      .merge(bubbles)
      .attr('stroke', (d, i) => this.colorsByKey[d.key] || this.colorScheme[i])
      .attr('cy', (d) => this.yScale(d.value));
    bubbles.exit().remove();

    this.hoverLine
      .attr('x1', this.xScale(hoverLineTimestamp) || 0)
      .attr('x2', this.xScale(hoverLineTimestamp) || 0)
      .attr('y1', this.yScale(this.maxY || 1) - 3)
      .attr('y2', this.yScale(0) + 3);

    if (this.mouseIn) {
      this.tts.renderTooltip(this.hoverLine.node(), this.tooltipTemplate, true);
    }

  }

  public onMouseEnter() {
    this.tts.renderTooltip(this.hoverLine.node(), this.tooltipTemplate, true);
  }

  public onMouseLeave() {
    this.tts.renderTooltip(this.hoverLine.node(), undefined);
  }

  public onZoom(event, width, height) {
    const nextRange = [this.chartMargin, width - this.chartMargin]
      .map(d => d3.event.transform.applyX(d));

    this.xScale.range(nextRange);

    const numberOfXDataPoints = this.tableData.length ? this.tableData.length : 0;
    const allXValues = this.tableData.length ? this.tableData.map((d) => d.timestamp) : [];
    const xAxis = super.getXAxisTicks(this.xScale, width, numberOfXDataPoints, allXValues);
    super.applyXAxis(this.xAxisG, xAxis, height);

    const pathLineDrawer = d3.line()
      .x((d) => this.xScale(d.x))
      .y((d) => this.yScale(d.y));

    this.seriesG.selectAll('path.series')
      .attr('d', pathLineDrawer);

    this.positionHoverLine();
  }

  public renderFor(width: number, height: number) {
    this.filteredKeys = this.keys.filter((key: string) => {
      return !(this.disabledKeys && this.disabledKeys.has(key));
    });
    const reversedKeys = [...this.filteredKeys].reverse();
    const dataset = reversedKeys.map((key: string) => {
      const series = this.tableData.map((columnData: any) => {
        const cellData = columnData[key];
        return !isUndefined(cellData) && {
          key,
          y: cellData,
          x: columnData.timestamp,
          data: columnData,
        };
      }).filter(Boolean);
      series.key = key;
      return series;
    });

    // const xMin = this.xMin || first(this.tableData).timestamp;
    // const xMax = this.xMax || last(this.tableData).timestamp;

    const domain = this.tableData.length
      ? [this.xMin, this.xMax]
      : [];

    this.xScale = d3.scaleTime()
      .domain(domain)
      .range([this.chartMargin, width - this.chartMargin]);

    this.maxY = dataset.reduce((currentMax: number, series: any[]) => {
      const seriesMax = series.reduce((currentSeriesMax: number, cell: any) => {
        return Math.max(currentSeriesMax, cell.y);
      }, 0);
      return Math.max(currentMax, seriesMax);
    }, 0);

    this.yScale = d3.scaleLinear()
      .domain([0, this.maxY || 1])
      .range([height, 0]);

    const xDomain = this.xScale.domain();
    const dataInDomain = this.tableData.filter((datum) => {
      return (datum.timestamp >= xDomain[0]) && (datum.timestamp <= xDomain[1]);
    });
    const numberOfXDataPoints = dataInDomain.length;
    const allXValues = this.tableData.length ? this.tableData.map((d) => d.timestamp) : [];
    const xAxis = super.getXAxisTicks(this.xScale, width, numberOfXDataPoints, allXValues);
    super.applyXAxis(this.xAxisG, xAxis, height);
    const yAxis = super.getLinearYAxis(this.yScale, width, this.yAxisFormatter);
    super.applyYAxis(this.yAxisG, yAxis);

    const pathLineDrawer = d3.line()
      .x((d) => this.xScale(d.x))
      .y((d) => this.yScale(d.y));

    // Create groups for each series, rects for each segment
    const paths = this.seriesG.selectAll('path.series')
      .data(dataset);
    paths.enter()
      .append('path')
      .style('fill', 'none')
      .style('stroke-width', '2px')
    .merge(paths)
      .attr('class', (d) => `series ${d.key}`)
      .attr('d', pathLineDrawer)
      .style('stroke', (d, i) => this.colorsByKey[d.key] || this.colorScheme[i])
      .style('stroke-opacity', (d) => {
        if (this.hoverSeries && (this.hoverSeries !== d.key)) {
          return 0.25;
        } else {
          return 1;
        }
      });
    paths.exit().remove();

    this.positionHoverLine();
    this.renderIndicators(this.indicators, this.tableData, this.maxY);
  }

  public renderHoverEffect() {
    this.seriesG.selectAll('path.series')
      .style('stroke-opacity', (d) => {
        if (this.hoverSeries && (this.hoverSeries !== d.key)) {
          return 0.25;
        } else {
          return 1;
        }
      });

  }


  public getNearestIndex(data, targetVal, key = 'timestamp') {
    let nearestIndex = 0
    let nearestVal = data[nearestIndex][key];
    for(let i = 1; i < data.length; i++) {
      const currentVal = data[i][key];
      const currentDist = Math.abs(currentVal - targetVal);
      const nearestDist = Math.abs(nearestVal - targetVal);
      if (currentDist >= nearestDist) {
        return nearestIndex;
      }
      nearestIndex = i;
      nearestVal = data[nearestIndex][key];
    }
    return nearestIndex;
  }

}
