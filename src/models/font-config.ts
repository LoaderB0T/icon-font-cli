import { FontFormat } from './font-format';

export interface FontConfig {
  fontName: string,
  collectionKeys?: string[],
  destinationFolder?: string,
  formats?: FontFormat[],
  fixedWidth?: boolean,
  fixedHeight?: boolean,
  normalize?: boolean,
  template?: 'css' | 'scss'
}
