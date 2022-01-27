import { Container } from 'inversify';

import { MainController } from './controller/main.controller';

import { FileSystemService } from './services/file-system.service';
import { LoggerService } from './services/logger.service';
import { ConfigService } from './services/config.service';
import { PromptService } from './services/prompt.service';
import { WorkspaceService } from './services/workspace.service';
import { ExecutionService } from './services/execution.service';
import { ContextService } from './services/context-service';
import { GenerateController } from './controller/generate.controller';
import { FontService } from './services/font.service';
import { CollectionController } from './controller/collection.controller';

const DIContainer = new Container();
DIContainer.bind<MainController>(MainController).toSelf().inSingletonScope();
DIContainer.bind<GenerateController>(GenerateController).toSelf().inSingletonScope();
DIContainer.bind<CollectionController>(CollectionController).toSelf().inSingletonScope();

DIContainer.bind<FileSystemService>(FileSystemService).toSelf().inSingletonScope();
DIContainer.bind<LoggerService>(LoggerService).toSelf().inSingletonScope();
DIContainer.bind<ContextService>(ContextService).toSelf().inSingletonScope();
DIContainer.bind<ConfigService>(ConfigService).toSelf().inSingletonScope();
DIContainer.bind<PromptService>(PromptService).toSelf().inSingletonScope();
DIContainer.bind<WorkspaceService>(WorkspaceService).toSelf().inSingletonScope();
DIContainer.bind<ExecutionService>(ExecutionService).toSelf().inSingletonScope();
DIContainer.bind<FontService>(FontService).toSelf().inSingletonScope();

export default DIContainer;
