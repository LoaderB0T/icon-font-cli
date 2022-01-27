import DIContainer from './di-container';
import { ContextService } from './services/context-service';

() => {
  DIContainer.get(ContextService).setContext({ calledFromCli: false });
};

export const iconFont = {};
