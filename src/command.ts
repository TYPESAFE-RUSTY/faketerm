import type { commandOutput } from "./commandOutput.js";
import { initContext, type TerminalContext } from "./context.js";

export abstract class exec {
  public context: TerminalContext = initContext;
  public stdin: string | null = null;
  setTerminalContext(context: TerminalContext): void {
    this.context = context;
  }
  abstract parse(args: string[]): void;
  abstract run(): commandOutput;
  abstract man(): string;
}
