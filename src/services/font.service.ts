const webfont = require('webfont').default;

import { inject, injectable } from 'inversify';
import path from 'path';
import { FontConfig } from '../models/font-config';
import { FileSystemService } from './file-system.service';

@injectable()
export class FontService {
  @inject(FileSystemService)
  private readonly _fileSystemService: FileSystemService;

  async generate(cfg: FontConfig, icons: string[]) {
    const files = `./icon-repo/**/?(${icons.join('|')}).svg`;

    const destPath = cfg.destinationFolder ?? './dest';
    this._fileSystemService.ensureDirectory(destPath);
    this._fileSystemService.deleteFilesInDirectory(destPath);

    let result: any;
    try {
      result = await webfont({
        files: files,
        fontName: cfg.fontName,
        template: cfg.template ?? this._fileSystemService.join(__dirname, '../../templates/', 'scss.njk'),
        normalize: true,
        fixedWidth: true,
        centerHorizontally: true
      });
    } catch (error) {
      console.error(error);
    }

    let destTemplate: any = null;

    if (result.template) {
      ({ destTemplate } = result.config);

      if (!destTemplate) {
        destTemplate = destPath;
      }

      if (result.usedBuildInTemplate) {
        destTemplate = path.join(destTemplate, `${result.config.fontName}.${result.config.template}`);
      } else {
        destTemplate = path.join(destTemplate, `${cfg.fontName}.${path.basename(result.config.template).replace('.njk', '')}`);
      }
    }

    Object.keys(result).map(type => {
      if (type === 'config' || type === 'usedBuildInTemplate' || type === 'glyphsData') {
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
