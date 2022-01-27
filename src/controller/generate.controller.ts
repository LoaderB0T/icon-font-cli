import { injectable } from 'inversify';
import { FontConfig } from '../models/font-config';
import { IconCollection } from '../models/icon-collection';

import { Controller } from './controller';

@injectable()
export class GenerateController extends Controller {
  public async generate() {
    const cfgName = 'graph';

    const cfg = this._fileSystemService.parseFile<FontConfig>(`./cfg/${cfgName}.json`);
    const allCollectionFiles = this._fileSystemService.getFilesFromGlob('./collections/*.json');
    const allCollections = allCollectionFiles
      .map(x => this._fileSystemService.parseFile<IconCollection>(x))
      .filter(x => (cfg.collectionKeys?.indexOf(x.name) || 0) > -1);

    const allIconArrays = allCollections.map(x => x.icons);
    const allIcons = this.mergeDedupe(allIconArrays);

    this._fontService.generate(cfg, allIcons);
  }

  private mergeDedupe<T>(arrays: T[][]) {
    let jointArray: T[] = [];
    arrays.forEach(array => {
      jointArray = [...jointArray, ...array];
    });
    return jointArray;
  }
}
