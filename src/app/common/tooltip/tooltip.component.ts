import {
  Component,
  ElementRef,
  Input,
  TemplateRef,
  ViewChild,
} from '@angular/core';

import { TooltipService } from '@src/app/common/tooltip/tooltip.service';

@Component({
  selector: 'dwu-tooltip',
  templateUrl: './tooltip.component.html',
  styleUrls: ['./tooltip.component.scss'],
})
export class TooltipComponent {
  @Input() text: string;
  @Input() template?: TemplateRef<any>;

  // Full template override
  @Input() customTemplate?: TemplateRef<any>;

  @ViewChild('defaultTemplate', { static: false }) defaultTemplate: TemplateRef<any>;
  // @HostBinding('attr.tabindex') tabIndex = '0';

  constructor(
    public hostEl: ElementRef,
    public tts: TooltipService,
  ) {}

  public ngAfterViewInit() {
    this.tts.registerTooltip(
      this.hostEl.nativeElement,
      this.customTemplate || this.defaultTemplate,
    );
  }
}
