import { injectable, inject } from 'inversify';
import chalk from 'chalk';
import figlet from 'figlet';
import { program } from 'commander';
import compareVersions from 'compare-versions';

import { Controller } from './controller';
import { GenerateController } from './generate.controller';
import { CollectionController } from './collection.controller';

@injectable()
export class MainController extends Controller {
  @inject(GenerateController)
  private readonly _generateController: GenerateController;
  @inject(CollectionController)
  private readonly _collectionController: CollectionController;
  private readonly _version: string;

  constructor() {
    super();
    const pjson = require(this._fileSystemService.join(__dirname, '../../package.json'));
    this._version = pjson.version;
  }

  public async main() {
    await this.checkForUpdates();

    // This is so useless, I love it.
    const fontWidth = process.stdout.columns > 111 ? 'full' : process.stdout.columns > 96 ? 'fitted' : 'controlled smushing';

    program.on('--help', () => {
      console.log(
        chalk.yellow(
          figlet.textSync(`gah-cli v${this._version}`, { horizontalLayout: fontWidth, font: 'Cricket', verticalLayout: 'full' })
        )
      );
    });
    console.log();

    program
      .version(this._version);

    program
      .option('--debug', 'Enables verbose debug logging');

    program
      .command('generate')
      .description('Generates the font based on a configuration file.')
      .alias('i')
      .action(async () => this._generateController.generate());

    const createCommand = program
      .command('create')
      .description('Create stuff.')
      .alias('c');
    createCommand
      .command('collection')
      .description('Create a new collection')
      .action(() => this._createController.create(collectionName))


    await program.parseAsync(process.argv);
  }


  private async checkForUpdates() {
    const gahData = this._workspaceService.getGlobalData();
    let checkNewVersion = false;

    if (gahData.latestVersion && compareVersions(gahData.latestVersion, this._version) === 1) {
      checkNewVersion = false;
    } else if (gahData.lastUpdateCheck) {
      const hoursPassed = Math.abs(new Date().getTime() - new Date(gahData.lastUpdateCheck).getTime()) / 36e5;
      if (hoursPassed > 1 || !gahData.latestVersion) {
        checkNewVersion = true;
      }
    } else {
      checkNewVersion = true;
    }

    if (checkNewVersion) {
      const success = await this._executionService.execute('yarn info --json icon-font-cli', false);
      if (success) {
        const versionString = this._executionService.executionResult;
        const versionMatcher = /{"type":"inspect","data":"(.*?)"}/;
        const newestVersion = versionString.match(versionMatcher);
        gahData.latestVersion = newestVersion?.[1];
        gahData.lastUpdateCheck = new Date();
      }
    }

    if (!gahData.latestVersion) {
      return;
    }

    if (compareVersions(gahData.latestVersion, this._version) === 1) {
      this._loggerService.warn('  * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *');
      this._loggerService.warn(`  *           ${chalk.green('A new version of icon-font-cli is available.')}            *`);
      this._loggerService.warn(`  *        Please install it via ${chalk.gray('yarn global add icon-font-cli')}        *`);
      this._loggerService.warn('  * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *');
    }

    this._workspaceService.saveGlobalData(gahData);
  }

}
