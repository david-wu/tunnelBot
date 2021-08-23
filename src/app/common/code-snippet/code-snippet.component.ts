import {
  AfterViewInit,
  Component,
  ElementRef,
  Input,
  OnChanges,
  ViewChild,
  ViewEncapsulation,
} from '@angular/core';
import hljs from 'highlight.js/lib/highlight';
import typescript from 'highlight.js/lib/languages/typescript';
import xml from 'highlight.js/lib/languages/xml';

@Component({
  selector: 'dwu-code-snippet',
  templateUrl: './code-snippet.component.html',
  styleUrls: [
    './styles/pre-code.scss',
    './styles/monokai.css',
    './code-snippet.component.scss',
  ],
  encapsulation: ViewEncapsulation.None,
})
export class CodeSnippetComponent implements OnChanges, AfterViewInit {
  @Input() snippet: string;
  @Input() fillsContainer: boolean;

  @ViewChild('codeEl', { static: false }) codeEl;

  /**
   * constructor
   * @param {ElementRef} hostEl
   */
  constructor(
    private hostEl: ElementRef,
  ) {}

  /**
   * ngOnChanges
   */
  public ngOnChanges(changes) {
    this.styleCodeEl(this.snippet);
  }

  /**
   * ngAfterViewInit
   */
  public ngAfterViewInit() {
    hljs.registerLanguage('typescript', typescript);
    hljs.registerLanguage('xml', xml);
    this.styleCodeEl(this.snippet);
    const allCodeBlocks = this.hostEl.nativeElement.querySelectorAll('pre code')
      .forEach((codeBlock: HTMLElement) => hljs.highlightBlock(codeBlock));
  }

  /**
   * styleCodeEl
   * @param {string}
   * @return {string}
   */
  public styleCodeEl(snippet: string): string {
    if (!this.codeEl) {
      return;
    }
    this.codeEl.nativeElement.textContent = snippet;
    hljs.highlightBlock(this.codeEl.nativeElement);
  }

}
