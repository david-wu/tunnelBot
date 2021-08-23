import {
  ElementRef,
  NgZone,
} from '@angular/core';
import ResizeSensor from 'css-element-queries/src/ResizeSensor';
import * as d3 from 'd3';
import { filter, last } from 'lodash';

export class BaseChartComponent {

  public sensor;
  public margins = {
    top: 15,
    right: 30,
    bottom: 20,
    left: 55,
  };

  public svg;
  public rootG;
  public seriesG;
  public xScale;
  public yScale;
  public xAxisG;
  public yAxisG;
  public indicatorsG;
  public clipPathRect;
  public mouseIn: boolean;
  // public clipPathRectAxis;

  constructor(
    public hostEl: ElementRef,
    public ngZone: NgZone,
    ) {}

  public ngAfterViewInit() {
    this.sensor = new ResizeSensor(this.hostEl.nativeElement, () => {
      this.render();
    });
  }

  public ngOnDestroy() {
    this.sensor.detach();
  }

  public initializeSvg() {
    this.ngZone.runOutsideAngular(() => {
      this.svg = d3.select(this.hostEl.nativeElement).append('svg')
        .style('position', 'absolute')
        .on('mousemove', () => this.onMouseMove())
        .on('touchstart', () => this.touchmove())
        .on('touchmove', () => this.touchmove());
    });

    this.svg
      .on('mouseenter', () => this._onMouseEnter())
      .on('mouseleave', () => this._onMouseLeave());

    this.rootG = this.svg.append('g');
    this.yAxisG = this.rootG.append('g')
      .attr('class', 'y axis');
    this.xAxisG = this.rootG.append('g')
      .attr('class', 'x axis')
      .attr('clip-path', 'url(#clip)');
    this.seriesG = this.rootG.append('g')
      .attr('clip-path', 'url(#clip)');

    this.indicatorsG = this.rootG.append('g');
    // this.applyZoom(this.svg);

    const defs = this.svg.append('defs');

    this.clipPathRect = defs.append('clipPath')
    .attr('id', 'clip')
    .append('rect')
    .attr('x', 0)
    .attr('y', 0);

    // this.clipPathRectAxis = defs.append('clipPath')
    //     .attr('id', 'clipAxis')
    //     .append('rect')
    //     .attr('x', 0)
    //     .attr('y', 0);

  }

  public touchmove() {
    // prevents following mouse event
    d3.event.stopPropagation();
    const touch = d3.touches(this.svg.node());
    const [x, y] = touch[0];
    this.onXYHover(x, y);
  }

  public _onMouseEnter() {
    this.mouseIn = true;
    this.onMouseEnter();
  }

  public _onMouseLeave() {
    this.mouseIn = false;
    this.onMouseLeave();
  }

  public onMouseEnter() {
  }

  public onMouseLeave() {
  }

  public onMouseMove() {
    const [x, y] = d3.mouse(this.svg.node());
    this.mouseIn = true;
    this.onXYHover(x, y);
  }

  public onXYHover(x: number, y: number) {
  }

  public renderFor(width, height) {
    throw new Error(('must implement renderFor'));
  }

  public getChartDim() {
    const elDim = this.getElDim();
    return {
      width: elDim.width - this.margins.left - this.margins.right,
      height: elDim.height - this.margins.top - this.margins.bottom,
    };
  }

  public render() {
    const { width, height } = this.getChartDim();
    this.svg
      .attr('width', width + this.margins.left + this.margins.right)
      .attr('height', height + this.margins.top + this.margins.bottom);

    this.rootG
      .attr('transform', 'translate(' + this.margins.left + ',' + this.margins.top + ')');

    this.clipPathRect
      .attr('width', width)
      .attr('height', height + this.margins.top);

    this.renderFor(width, height);
  }

  public getLinearYAxis(yScale, width: number, formatter?: any) {
    const baseAxis = d3.axisLeft()
      .scale(yScale)
      .ticks(6)
      .tickSize(-width, 0, 0);

    if (formatter) {
      return baseAxis.tickFormat(formatter);
    } else {
      return baseAxis.tickFormat((d: number) => d.toLocaleString());
    }
  }

  public applyYAxis(yAxisG, yAxis) {
    return yAxisG.call(yAxis)
      .call(g => g.select('.domain')
        .remove())
      .call(g => g.selectAll('.tick:not(:first-of-type) line')
        .attr('stroke-opacity', 0.5)
        .attr('stroke-dasharray', '2,2'));
  }

  public getXAxisTicks(xScale: any, width: number, numberOfXDataPoints: number, allXValues: any[]) {
    const filteredXDomainValues = this.getFilteredTickValues(allXValues, width, numberOfXDataPoints);
    return d3.axisBottom()
      .scale(xScale)
      .tickSizeOuter(0)
      .tickValues(filteredXDomainValues)
      .tickFormat(d3.timeFormat('%-m/%e'));
  }

  public getXBandAxis(xScale: any, width: number, numberOfXDataPoints: number) {
    const ticks = xScale.domain();
    const filteredXDomainValues = this.getFilteredTickValues(ticks, width, numberOfXDataPoints);
    return d3.axisBottom()
      .scale(xScale)
      .tickSizeOuter(0)
      .tickValues(filteredXDomainValues)
      .tickFormat(d3.timeFormat('%-m/%-d'));
  }

  public applyXAxis(xAxisG, xAxis, height) {
    return xAxisG
      .attr('transform', 'translate(0,' + height + ')')
      .call(xAxis);
  }

  public getFilteredTickValues(ticks, width, numberOfXDataPoints) {
    const xDomainInterval = this.getXDomainInterval(width, numberOfXDataPoints);
    const remainder = numberOfXDataPoints % xDomainInterval;
    return ticks.filter((d, i) => {
      // (i + 1 - remainder) makes sure the most recent datapoint's tick is always visible
      return !((i + 1 - remainder) % xDomainInterval);
    });
  }

  public getXDomainInterval(width: number, numberOfXDataPoints: number) {
    const maxXpoints = this.getMaxXPoints(width);
    let xPoints = numberOfXDataPoints;
    let interval = 1;
    while (xPoints > maxXpoints) {
      interval++;
      xPoints = numberOfXDataPoints / interval;
    }
    return interval;
  }

  public getMaxXPoints(width: number) {
    return Math.floor(width / 30);
  }

  public getElDim() {
    return {
      width: this.hostEl.nativeElement.clientWidth,
      height: this.hostEl.nativeElement.clientHeight,
    };
  }

  public renderIndicators(indicators, tableData, maxY, barStepWidth = 0) {
    const cleanIndicatorData = filter(indicators, (indicatorInfo) => {
      return (indicatorInfo.value >= tableData[0].timestamp)
      && (indicatorInfo.value <= last(tableData).timestamp);
    });
    const indicatorLines = this.indicatorsG.selectAll('line.indicators')
      .data(cleanIndicatorData);
    indicatorLines.enter()
      .append('line')
      .attr('class', 'indicators')
      .style('stroke-opacity', '1')
      .style('stroke-width', '2')
      .style('stroke-dasharray', '2 3')
      .style('stroke-opacity', '0.8')
      .merge(indicatorLines)
      .style('stroke', (d) => d.color || '#292E12')
      .attr('x1', (d) => (this.xScale(d.value) || 0) + (barStepWidth / 2))
      .attr('x2', (d) => (this.xScale(d.value) || 0) + (barStepWidth / 2))
      .attr('y1', this.yScale(maxY))
      .attr('y2', this.yScale(0) + 3);
    indicatorLines.exit().remove();

    const indicatorText = this.indicatorsG.selectAll('text.indicators')
      .data(cleanIndicatorData);
    indicatorText.enter()
      .append('text')
      .attr('class', 'indicators')
      .attr('font-size', '12')
      .style('opacity', '0.8')
      .merge(indicatorText)
      .attr('text-anchor', 'middle')
      .text((d) => d.label || '')
      .style('fill', (d) => d.color || '#292E12')
      .attr('x', (d) => (this.xScale(d.value) || 0) + (barStepWidth / 2))
      .attr('y', this.yScale(maxY) - 3);
    indicatorText.exit().remove();

  }

  public onZoom(event, width, height) {

  }

  public applyZoom(root, width?, height?) {
    if (!width || !height) {
      const chartDim = this.getChartDim();
      width = chartDim.width;
      height = chartDim.height;
    }

    const extent = [
    [0, 0],
    [width, height],
    ];

    root.call(
      d3.zoom()
        .scaleExtent([1, 8])
        .translateExtent(extent)
        .extent(extent)
        .on('zoom', () => this.onZoom(d3.event, width, height)),
    );

  }
}
