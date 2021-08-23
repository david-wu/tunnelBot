import {
  Component,
} from '@angular/core';

@Component({
  selector: 'dwu-code-snippet-demo',
  templateUrl: './code-snippet-demo.component.html',
  styleUrls: ['./code-snippet-demo.component.scss'],
})
export class CodeSnippetDemoComponent {
  public demoSnippet = `console.log('This is a demo Snippet');`;

  public usageSnippet =
`<dwu-code-snippet
  [snippet]="demoSnippet"
></dwu-code-snippet>`;
  public usageSnippetCode = `public demoSnippet: string = \`console.log('This is a demo Snippet');\`;`;

}
