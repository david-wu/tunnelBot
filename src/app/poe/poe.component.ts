import { Component } from '@angular/core';

import { PoeService } from '@src/app/poe/services/poe.service';

@Component({
  selector: 'poe',
  templateUrl: './poe.component.html',
  styleUrls: ['./poe.component.scss']
})
export class PoeComponent {

  public jsonParseError: string;
  public rawJson;

  constructor(public poeService: PoeService) {}

  public ngOnInit() {
    // https://www.pathofexile.com/character-window/get-stash-items?league=Harvest&tabs=1&tabIndex=18&accountName=Dawu
    // this.poeService.getPublicStashes('dawu').subscribe((poeResponse) => {
    //   console.log('poeResponse', poeResponse)
    // });
    // this.parseJsonStr(jsonStr);
  }

  public onJsonChange(jsonStr: string) {
    this.parseJsonStr(jsonStr);
  }

  public parseJsonStr(jsonStr: string) {
    let json;
    try {
      json = JSON.parse(jsonStr);
    } catch (err) {
      this.jsonParseError = err;
      return;
    }
    console.log('json', json);
    const explicitModifiersByItemId = {};
    const itemNamesById = {};
    const modNames = [];

    json.items.forEach((item) => {
      const explicitMods = item.explicitMods || [];
      explicitModifiersByItemId[item.id] = explicitMods;
      itemNamesById[item.id] = item.name;

      explicitMods.forEach((mod: string) => {
        const matchedValues = [];
        const regex = /[0-9]+/ig;
        const modName = mod.replace(regex, (matchVal: string) => {
          matchedValues.push(matchVal);
          return '_';
        });
        modNames.push(modName);
      });
    });

    console.log('modNames', modNames);
  }
}



