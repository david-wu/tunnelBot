import {
  Component,
} from '@angular/core';

@Component({
  selector: 'dwu-fuzz-demo',
  templateUrl: './fuzz-demo.component.html',
  styleUrls: [
    './fuzz-demo.component.scss',
  ],
})
export class FuzzDemoComponent {

  public readonly codeBlocks = {
    howToUse:
`import { Fuzz } from 'fuzz-js';

const users = [
  { name: 'Allen' },
  { name: 'Maggie' },
  { name: 'Margret' },
];
const results = Fuzz.filter(users, 'mggi');
  // -> [ { name: "Maggie" } ]`,
    howToUseHard:
`import { Fuzz } from 'fuzz-js';

const users = [
  { name: 'Allen', occupation: 'therapist' },
  { name: 'Maggie', occupation: 'musician' },
  { name: 'Margret', occupation: 'magician' },
];
const options = {
  subjectKeys: ['occupation'],
  startDecorator: '<i>',
  endDecorator: '</i>',
};
const results = Fuzz.search(users, 'maggi', options);
  /**
   *
   *  [
   *    {
   *      "original": { "name": "Margret", "occupation": "magician" },
   *      "key": "occupation",
   *      "subject": "magician",
   *      "query": "maggi",
   *      "editDistance": 108,
   *      "score": 0.7874015748031495,
   *      "matchRanges": [[0, 3]],
   *      "styledString": "<i>magi</i>cian"
   *    }
   *  ]
   */`,
  };

}
