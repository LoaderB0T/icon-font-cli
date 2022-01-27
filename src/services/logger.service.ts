import { injectable, inject } from 'inversify';
import chalk from 'chalk';
import { ContextService } from './context-service';
import { AwesomeLogger, AwesomeLoggerSpinnerControl } from 'awesome-logging';

/**
 * TODO: Add logging to a file (error only or all)
 * Either flag or property in GahConfig!
 */

@injectable()
export class LoggerService implements LoggerService {
  private _spinner: AwesomeLoggerSpinnerControl;

  @inject(ContextService)
  private readonly _contextService: ContextService;

  private get debugLoggingEnabled(): boolean {
    return this._contextService.getContext().debug ?? false;
  }

  public log(text: string) {
    AwesomeLogger.interrupt(text);
  }

  public warn(text: string) {
    AwesomeLogger.interrupt(chalk.yellow(' ■ ') + text);
  }
  public error(text: string) {
    AwesomeLogger.interrupt(chalk.red(' ■ ') + text);
  }
  public debug(text: string) {
    if (this.debugLoggingEnabled) {
      AwesomeLogger.interrupt(chalk.magenta(' ■ ') + text);
    }
  }
  public success(text: string) {
    AwesomeLogger.interrupt(chalk.green(' ■ ') + text);
  }

  public startLoadingAnimation(text: string) {
    this._spinner = AwesomeLogger.log('spinner', {
      text
    });
  }

  public stopLoadingAnimation(removeLine: boolean = false, succeeded: boolean = true, text?: string): void {
    this._spinner.stop({ succeeded, text, removeLine });
  }
}
