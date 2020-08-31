import { injectable } from 'inversify';

import { Controller } from './controller';


@injectable()
export class GenerateController extends Controller {

  public async generate() {
    this._fontService.generate(
      {
        fontName: 'test123',
        iconRepoBaseFolder: 'C:/git_repos/@awdware/icon-font-cli/test/icon-repo'
      }
    );
  }
}
