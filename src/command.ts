import type { commandOutput } from "./commandOutput.js";
import { initContext, type TerminalContext } from "./context.js";

export abstract class exec {
  public context: TerminalContext = initContext;
  public stdin: string | null = null;
  setTerminalContext(context: TerminalContext): void {
    this.context = context;
  }
  protected abstract parse(args: string[]): void;
  abstract run(args: string[]): commandOutput;
  abstract man(): string;
}
