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

import { TooltipService } from '@common/tooltip/tooltip.service';
import { BaseChartComponent } from '@src/app/common/charts/base-chart/base-chart.component';

@Component({
  selector: 'dwu-bar-chart',
  templateUrl: './bar-chart.component.html',
  styleUrls: ['./bar-chart.component.scss'],
  providers: [TooltipService],
})
export class BarChartComponent extends BaseChartComponent {

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
  @Input() hoverIndex = 0;
  @Input() yAxisFormatter: any;
  @Output() hoverIndexChange: EventEmitter<number> = new EventEmitter<number>();
  @Input() indicators: any[];

  @Input() tooltipTemplate: TemplateRef<any>;

  public barPadding = 0.05;
  public hoverBox;
  public maxY;

  // some extra margin on the chart itself
  public chartMargin = 10;

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
    if (changes.tableData || changes.disabledKeys) {
      if (this.tableData) {
        this.render();
      }
    }
    if (changes.hoverIndex) {
      this.positionHoverBox();
    }
    if (changes.indicators) {
      this.renderIndicators(this.indicators, this.tableData, this.maxY, this.xScale.step());
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
    this.hoverBox = this.rootG.append('rect')
      .attr('class', 'hover-box')
      .style('fill', '#8A9A5B')
      .style('fill-opacity', '0.25')
      .style('stroke', '#8A9A5B')
      .style('stroke-opacity', '1')
      .style('stroke-width', '1')
      .attr('clip-path', 'url(#clip)');
  }

  public onXYHover(x: number, y: number) {
    const numberOfXDataPoints = this.tableData && this.tableData.length;
    if (!numberOfXDataPoints) {
      return;
    }
    const distanceBetweenBars = this.xScale.step();
    const paddingWidth = this.barPadding * distanceBetweenBars;
    const startingPx = this.xScale(this.tableData[0].timestamp);
    const xOnChart = x - this.margins.left - startingPx - (paddingWidth / 2);
    const rawIndex = Math.floor(xOnChart / distanceBetweenBars);
    const hoverIndex = Math.min(Math.max(rawIndex, 0), numberOfXDataPoints - 1);
    if (hoverIndex !== this.hoverIndex) {
      this.ngZone.run(() => {
        this.hoverIndex = hoverIndex;
        this.hoverIndexChange.emit(hoverIndex);
      });
    }
  }

  public positionHoverBox() {
    if (this.hoverIndex === undefined) {
    return;
    }
    const hoverBoxTimestamp = this.tableData[this.hoverIndex].timestamp;
    this.hoverBox
    .attr('x', this.xScale(hoverBoxTimestamp))
    .attr('y', this.yScale(this.maxY))
    .attr('width', this.xScale.bandwidth)
    .attr('height', this.yScale(0) - this.yScale(this.maxY));

    if (this.mouseIn) {
    this.tts.renderTooltip(this.hoverBox.node(), this.tooltipTemplate, true);
    }
  }

  public onMouseEnter() {
    this.tts.renderTooltip(this.hoverBox.node(), this.tooltipTemplate, true);
  }

  public onMouseLeave() {
    this.tts.renderTooltip(this.hoverBox.node(), undefined);
  }

  public onZoom(event, width, height) {
    const nextRange = [this.chartMargin, width - this.chartMargin]
    .map(d => d3.event.transform.applyX(d));

    this.xScale.range(nextRange);

    const numberOfXDataPoints = this.tableData.length ? this.tableData.length : 0;
    const xAxis = super.getXBandAxis(this.xScale, width, numberOfXDataPoints);
    super.applyXAxis(this.xAxisG, xAxis, height);

    this.seriesG.selectAll('g.series').selectAll('rect')
    .attr('x', (d) => this.xScale(d.data.timestamp))
    .attr('width', this.xScale.bandwidth());

    this.positionHoverBox();
  }

  public renderFor(width: number, height: number) {

    const filteredKeys = this.keys.filter((key: string) => {
      return !(this.disabledKeys && this.disabledKeys.has(key));
    });
    const reversedKeys = filteredKeys.reverse();
    const stack = d3.stack().keys(reversedKeys);
    const dataset = stack(this.tableData);

    const domain = dataset.length ? dataset[0].map((d) => d.data.timestamp) : [];
    this.xScale = d3.scaleBand()
      .domain(domain)
      .range([this.chartMargin, width - this.chartMargin])
      .paddingOuter(0)
      .paddingInner(this.barPadding);

    this.maxY = dataset.reduce((currentMax: number, series: number[][]) => {
      const seriesMax = series.reduce((currentSeriesMax: number, stack: number[]) => {
        return Math.max(currentSeriesMax, ...stack);
      }, 0);
      return Math.max(currentMax, seriesMax);
    }, 0);

    this.yScale = d3.scaleLinear()
      .domain([0, this.maxY])
      .range([height, 0]);

    const numberOfXDataPoints = this.tableData.length ? this.tableData.length : 0;
    const xAxis = super.getXBandAxis(this.xScale, width, numberOfXDataPoints);
    super.applyXAxis(this.xAxisG, xAxis, height);
    const yAxis = super.getLinearYAxis(this.yScale, width, this.yAxisFormatter);
    super.applyYAxis(this.yAxisG, yAxis);

    // Create groups for each series, rects for each segment
    const groups = this.seriesG.selectAll('g.series')
      .data(dataset);
    groups.enter()
      .append('g')
      .attr('class', (d) => `series ${d.key}`)
      .merge(groups)
      .style('fill', (d, i) => this.colorsByKey[d.key] || this.colorScheme[i]);
    groups.exit().remove();

    // reusing "groups" selection doesn't work, not sure why
    // explicitly selectAll again before rebinding works
    const rects = this.seriesG.selectAll('g.series').selectAll('rect')
      .data((series) => {
        series.forEach((points: any) => {
          points.seriesKey = series.key;
        });
        return series;
      });
    rects.enter()
      .append('rect')
      .merge(rects)
      .attr('x', (d) => this.xScale(d.data.timestamp))
      .attr('y', (d) => this.yScale(d[1]))
      .attr('height', (d) => this.yScale(d[0]) - this.yScale(d[1]))
      .attr('width', this.xScale.bandwidth());

    rects.exit().remove();

    this.positionHoverBox();
    this.renderIndicators(this.indicators, this.tableData, this.maxY, this.xScale.step());
  }

}
