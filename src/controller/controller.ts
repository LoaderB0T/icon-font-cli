import DIContainer from '../di-container';
import { injectable } from 'inversify';
import { FontService } from '../services/font.service';
import { WorkspaceService } from '../services/workspace.service';
import { ExecutionService } from '../services/execution.service';
import { LoggerService } from '../services/logger.service';
import { FileSystemService } from '../services/file-system.service';

@injectable()
export abstract class Controller {
  protected _fontService: FontService;
  protected _workspaceService: WorkspaceService;
  protected _executionService: ExecutionService;
  protected _loggerService: LoggerService;
  protected _fileSystemService: FileSystemService;

  constructor() {
    this._fontService = DIContainer.get(FontService);
    this._workspaceService = DIContainer.get(WorkspaceService);
    this._executionService = DIContainer.get(ExecutionService);
    this._loggerService = DIContainer.get(LoggerService);
    this._fileSystemService = DIContainer.get(FileSystemService);
  }
}
