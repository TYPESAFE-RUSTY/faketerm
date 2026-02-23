import { commandOutput, ExitCode } from "./commandOutput.js";
import { parseFileNode } from "./fileSystem.js";
import { type TerminalContext, initContext } from "./context.js";
import { getExec } from "./dispatcher.js";

export class fakeTerminal {
  private context: TerminalContext = initContext;

  public setUser(name: string) {
    this.context.currentUser = name;
  }

  public parseFS(data: string): void {
    this.context.fileSystem = parseFileNode(data);
    this.context.currentNodeRef = this.context.fileSystem;
    this.context.currentWorkingDirectory = this.context.fileSystem.name;
  }

  private getArgs(s: string): [string, string] {
    const firstSpaceIndex = s.indexOf(" ");
    if (firstSpaceIndex === -1) return [s, ""];
    // remove unnecessary trims
    return [
      s.slice(0, firstSpaceIndex).trim(),
      s.slice(firstSpaceIndex + 1).trim(),
    ];
  }

  public runCommand(expression: string): commandOutput {
    // reduce commands from the input down to individual items
    const commands = expression.trim().split("|");
    let response: commandOutput = new commandOutput(ExitCode.EXIT_FAILURE);

    // pipe things down if required
    for (let i = 0; i < commands.length; i++) {
      const command = commands[i]?.trim() || "";
      // will handle for >, <, << in future ;(
      const [exec, args] = this.getArgs(command);

      let currentCommand = getExec(exec);
      if (!currentCommand) {
        response = new commandOutput(
          ExitCode.EXIT_FAILURE,
          null,
          `${this.context.shellName}: Unknown command : ${exec}`,
        );
        continue;
      }

      currentCommand.setTerminalContext(this.context);
      currentCommand.stdin = response.stdout();
      currentCommand.parse(args.split(" "));
      response = currentCommand.run();
    }

    return response;
  }

  // will work on async in future probably
  // async runCommandAsync(command: string): Promise<commandOutput> {
  //   return new Promise((resolve, reject) => {
  //     resolve(new commandOutput(ExitCode.EXIT_SUCCESS));
  //   });
  // }

  public getHistory(index: number): string | undefined {
    return this.context.commandHistory.at(index);
  }
}
