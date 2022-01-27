import { injectable, inject } from 'inversify';

import { FileSystemService } from './file-system.service';

@injectable()
export class ConfigService {
  @inject(FileSystemService)
  private readonly _fileSystemService: FileSystemService;
}
