
import {
  ApplicationRef,
  ComponentFactoryResolver,
  EmbeddedViewRef,
  Injectable,
  Injector,
  TemplateRef,
} from '@angular/core';
import { TooltipViewComponent } from '@common/tooltip/tooltip-view.component';
import {
  map,
  some,
} from 'lodash';
import {
  BehaviorSubject,
  combineLatest,
} from 'rxjs';

@Injectable()
export class TooltipService {

  public rootElement = document && document.body;
  public tooltipViewRef: any;
  public tooltipView: any;

  public hoverEl$: BehaviorSubject<HTMLElement> = new BehaviorSubject(undefined);
  public templatesByEl$: BehaviorSubject<Map<HTMLElement, TemplateRef<any>>> = new BehaviorSubject(new Map());
  public readonly arrowSize: number = 10;
  public approxTooltipWidth = 250;
  public approxTooltipHeight = 125;

  constructor(
    private componentFactoryResolver: ComponentFactoryResolver,
    private appRef: ApplicationRef,
    private injector: Injector
  ) {
    this.tooltipViewRef = this.appendComponentToDocBody(TooltipViewComponent);
    this.tooltipView = this.tooltipViewRef.instance;

    combineLatest(
      this.hoverEl$,
      this.templatesByEl$,
    )
      .subscribe(([hoverEl, templatesByEl]: [HTMLElement, Map<HTMLElement, TemplateRef<any>>]) => {
        const template = templatesByEl.get(hoverEl);
        this.renderTooltip(hoverEl, template);
      });
  }

  public renderTooltip(hoverEl, template, horizontalOnly = false) {
    const hoverComponent = this.tooltipView;
    if (!hoverEl) {
      this.tooltipView.template = undefined;
      return;
    }
    const boundingRect = hoverEl.getBoundingClientRect();
    const viewPortDim = this.getDocumentViewportDim();
    const protrudingBy = this.getProtrudingBy(boundingRect, viewPortDim);
    const tooltipDirection = this.getTooltipDirection(protrudingBy, horizontalOnly);
    const tooltipPositions = this.getTooltipPositions(boundingRect, tooltipDirection);

    this.tooltipView.template = template;
    this.tooltipView.top = tooltipPositions.top;
    this.tooltipView.left = tooltipPositions.left;
    this.tooltipView.transform = tooltipPositions.transform;
  }

  public getDocumentViewportDim() {
    return {
      width: Math.max(document.documentElement.clientWidth || 0, window.innerWidth || 0),
      height: Math.max(document.documentElement.clientHeight || 0, window.innerHeight || 0),
    };
  }

  public getProtrudingBy(boundingRect, viewPortDim) {
    return {
      BOTTOM: this.approxTooltipHeight - boundingRect.top,
      LEFT: boundingRect.left + boundingRect.width + this.approxTooltipWidth - viewPortDim.width,
      TOP: boundingRect.top + boundingRect.height + this.approxTooltipHeight - viewPortDim.height,
      RIGHT: this.approxTooltipWidth - boundingRect.left,
    };

    return [
      this.approxTooltipHeight - boundingRect.top,
      boundingRect.left + boundingRect.width + this.approxTooltipWidth - viewPortDim.width,
      boundingRect.top + boundingRect.height + this.approxTooltipHeight - viewPortDim.height,
      this.approxTooltipWidth - boundingRect.left,
    ];
  }

  public getTooltipDirection(protrudingBy, horizontalOnly) {
    let protrudingList = map(protrudingBy, (value, key) => [key, value]);
    if (!some(protrudingList, ([direction, protrudingBy]) => protrudingBy > 0)) {
      return horizontalOnly ? 'LEFT' : 'TOP';
    }

    if (horizontalOnly) {
      protrudingList = protrudingList.filter((d) => {
        return (d[0] === 'RIGHT') || (d[0] === 'LEFT');
      });
    }
    protrudingList.sort((a, b) => b[1] - a[1]);
    return protrudingList[0][0];
  }

  public getTooltipPositions(boundingRect, direction) {
    if (direction === 'TOP') {
      return {
        top: `${boundingRect.top - this.arrowSize}px`,
        left: `${boundingRect.left + (boundingRect.width / 2)}px`,
        transform: `translate(-50%, -100%)`,
      };
    }
    if (direction === 'LEFT') {
      return {
        top: `${boundingRect.top + (boundingRect.height / 2)}px`,
        left: `${boundingRect.left - this.arrowSize}px`,
        transform: `translate(-100%, -50%)`,
      };
    }
    if (direction === 'RIGHT') {
      return {
        top: `${boundingRect.top + (boundingRect.height / 2)}px`,
        left: `${boundingRect.left + boundingRect.width + this.arrowSize}px`,
        transform: `translate(0, -50%)`,
      };
    }
    if (direction === 'BOTTOM') {
      return {
        top: `${boundingRect.top + boundingRect.height + this.arrowSize}px`,
        left: `${boundingRect.left + (boundingRect.width / 2)}px`,
        transform: `translate(-50%, 0)`,
      };
    }
  }

  public registerTooltip(tooltipEl: HTMLElement, tooltipTemplate: TemplateRef<any>) {
    const nextTemplatesByEl = new Map(this.templatesByEl$.value);
    nextTemplatesByEl.set(tooltipEl, tooltipTemplate);
    this.templatesByEl$.next(nextTemplatesByEl);

    const enterHandler = () => {
      this.hoverEl$.next(tooltipEl);
    };
    const leaveHandler = () => {
      this.hoverEl$.next(undefined);
    };
    tooltipEl.addEventListener('mouseenter', enterHandler);
    tooltipEl.addEventListener('focus', enterHandler);
    tooltipEl.addEventListener('mouseleave', leaveHandler);
    tooltipEl.addEventListener('blur', leaveHandler);
  }

  public appendComponentToDocBody(component: any) {
    const componentRef = this.componentFactoryResolver
      .resolveComponentFactory(component)
      .create(this.injector);

    // Attach component to appRef for change detection
    this.appRef.attachView(componentRef.hostView);

    const domElem = (componentRef.hostView as EmbeddedViewRef<any>).rootNodes[0] as HTMLElement;
    document.body.appendChild(domElem);
    return componentRef;
  }

  public ngOnDestroy() {
    this.appRef.detachView(this.tooltipViewRef.hostView);
    this.tooltipViewRef.destroy();
  }

}
