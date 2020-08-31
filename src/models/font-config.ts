import { FontFormat } from './font-format';

export interface FontConfig {
  fontName: string,
  iconRepoBaseFolder: string,
  categoryKeys?: string[],
  destinationFolder?: string,
  formats?: FontFormat[],
  fixedWidth?: boolean,
  fixedHeight?: boolean,
  normalize?: boolean,
  template?: 'css' | 'scss'
}
