import {
  Component,
  ElementRef,
  HostBinding,
  TemplateRef,
} from '@angular/core';

@Component({
  selector: 'dwu-tooltip-view',
  templateUrl: './tooltip-view.component.html',
  styleUrls: ['./tooltip-view.component.scss'],
})
export class TooltipViewComponent {

  public template: TemplateRef<any>;
  // public top: number;
  // public left: number;
  @HostBinding('style.top') top = '0';
  @HostBinding('style.left') left = '0';
  public transform: string;

  constructor(public hostEl: ElementRef) {}

}
