const webfont = require('webfont').default;

import { inject, injectable } from 'inversify';
import path from 'path';
import { FontConfig } from '../models/font-config';
import { FileSystemService } from './file-system.service';

@injectable()
export class FontService {

  @inject(FileSystemService)
  private readonly _fileSystemService: FileSystemService;

  async generate(cfg: FontConfig) {

    const srcPath = `${cfg.iconRepoBaseFolder}/*.svg`;
    const destPath = cfg.destinationFolder ?? './dest';
    this._fileSystemService.ensureDirectory(destPath);
    this._fileSystemService.deleteFilesInDirectory(destPath);

    const result = await webfont({
      files: srcPath,
      fontName: cfg.fontName,
      template: cfg.template ?? 'scss'
    });

    let destTemplate: any = null;

    if (result.template) {
      ({ destTemplate } = result.config);

      if (!destTemplate) {
        destTemplate = destPath;
      }

      if (result.usedBuildInTemplate) {
        destTemplate = path.join(
          destTemplate,
          `${result.config.fontName}.${result.config.template}`
        );
      } else {
        destTemplate = path.join(
          destTemplate,
          path.basename(result.config.template).replace('.njk', '')
        );
      }
    }

    Object.keys(result).map(type => {
      if (type === 'config' ||
        type === 'usedBuildInTemplate' ||
        type === 'glyphsData') {
        return null;
      }

      const content = result[type];
      let file = null;

      if (type !== 'template') {
        file = path.resolve(path.join(destPath, `${cfg.fontName}.${type}`));
      } else {
        file = path.resolve(destTemplate);
      }

      this._fileSystemService.saveFile(file, content);
    });
  }
}
