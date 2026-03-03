import { commandOutput, ExitCode } from "./commandOutput.js";
import { parseFileNode } from "./fileSystem.js";
import { type TerminalContext, initContext } from "./context.js";
import { exec } from "./command.js";
import {
  ls,
  cd,
  pwd,
  whoami,
  echo,
  man,
  cat,
  touch,
  rm,
  mkdir,
  rmdir,
} from "./commands/export.js";
import mri from "mri";

export { exec, commandOutput, ExitCode, mri }; // building blocks for commands.

export class fakeTerminal {
  private context: TerminalContext = initContext;

  public constructor() {
    this.context.commandRegistry.set("ls", new ls());
    this.context.commandRegistry.set("cd", new cd());
    this.context.commandRegistry.set("pwd", new pwd());
    this.context.commandRegistry.set("whoami", new whoami());
    this.context.commandRegistry.set("echo", new echo());
    this.context.commandRegistry.set("man", new man());
    this.context.commandRegistry.set("cat", new cat());
    this.context.commandRegistry.set("touch", new touch());
    this.context.commandRegistry.set("rm", new rm());
    this.context.commandRegistry.set("mkdir", new mkdir());
    this.context.commandRegistry.set("rmdir", new rmdir());
  }

  public setUser(name: string) {
    this.context.currentUser = name;
  }

  public setShellName(shellName: string) {
    this.context.shellName = shellName;
  }

  public registerCommand(commandName: string, command: exec): void {
    this.context.commandRegistry.set(commandName, command);
  }

  public getRegisteredCommandClass(commandName: string): exec | undefined {
    return this.context.commandRegistry.get(commandName);
  }

  public getRegisteredCommands(): string[] {
    return this.context.commandRegistry.keys().toArray();
  }

  public getHistory(index: number): string | undefined {
    return this.context.commandHistory.at(index);
  }

  // to return current working directory without messing up the command history
  public getPresentWorkingDirectory(): string {
    return this.context.currentWorkingDirectory;
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

  private boundedPush<T>(array: T[], element: T) {
    array.push(element);
    if (array.length > this.context.commandHistoryLength) {
      array.shift();
    }
  }

  private updateHistory(expression: string) {
    this.boundedPush(this.context.commandHistory, expression);
  }

  public runCommand(expression: string): commandOutput {
    this.updateHistory(expression);
    // reduce commands from the input down to individual items
    const commands = expression.trim().split("|");
    let response: commandOutput = new commandOutput(ExitCode.EXIT_FAILURE);

    // pipe things down if required
    for (let i = 0; i < commands.length; i++) {
      const command = commands[i]?.trim() || "";
      // will handle for >, <, << in future ;(
      const [exec, args] = this.getArgs(command);

      let currentCommand = this.context.commandRegistry.get(exec);
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
      response = currentCommand.run(args.split(" "));
    }

    return response;
  }
}
