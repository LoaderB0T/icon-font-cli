import { injectable } from 'inversify';

export interface GahContext {
  calledFromCli?: boolean;
  calledFromHostFolder?: boolean;
  debug?: boolean;
}

@injectable()
export class ContextService {
  private readonly _ctx: GahContext;

  constructor() {
    this._ctx = {};
  }

  setContext(context: Partial<GahContext>): void {
    Object.keys(context).forEach(k => {
      (this._ctx as any)[k] = (context as any)[k];
    });
  }
  getContext(): GahContext {
    return this._ctx;
  }
}
