import { injectable, inject } from 'inversify';
import { FileSystemService } from './file-system.service';
import { platform, homedir } from 'os';
import { GlobalData } from '../models/global-data';

@injectable()
export class WorkspaceService {
  @inject(FileSystemService)
  private readonly _fileSystemService: FileSystemService;

  public getGlobalCfgFolder(): string {
    if (platform() === 'win32') {
      return this._fileSystemService.join(process.env.APPDATA!, '..', 'Local', 'awdware', 'icon-font-cli');
    } else {
      return this._fileSystemService.join(homedir(), 'awdware', 'icon-font-cli');
    }
  }

  public getGlobalData(): GlobalData {
    const globalDataPath = this._fileSystemService.join(this.getGlobalCfgFolder(), 'data.json');
    if (!this._fileSystemService.fileExists(globalDataPath)) {
      return {} as GlobalData;
    }
    return this._fileSystemService.parseFile<GlobalData>(globalDataPath);
  }
  public saveGlobalData(data: GlobalData) {
    const globalDataPath = this._fileSystemService.join(this.getGlobalCfgFolder(), 'data.json');
    this._fileSystemService.ensureDirectory(this.getGlobalCfgFolder());
    return this._fileSystemService.saveObjectToFile(globalDataPath, data);
  }
}
