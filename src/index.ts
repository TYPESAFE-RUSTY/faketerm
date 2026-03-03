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
    this.registerCommand("ls", () => new ls());
    this.registerCommand("cd", () => new cd());
    this.registerCommand("pwd", () => new pwd());
    this.registerCommand("whoami", () => new whoami());
    this.registerCommand("echo", () => new echo());
    this.registerCommand("man", () => new man());
    this.registerCommand("cat", () => new cat());
    this.registerCommand("touch", () => new touch());
    this.registerCommand("rm", () => new rm());
    this.registerCommand("mkdir", () => new mkdir());
    this.registerCommand("rmdir", () => new rmdir());
  }

  public setUser(name: string) {
    this.context.currentUser = name;
  }

  public setShellName(shellName: string) {
    this.context.shellName = shellName;
  }

  public registerCommand(commandName: string, command: () => exec): void {
    this.context.commandRegistry.set(commandName, command);
  }

  public getRegisteredCommandClass(commandName: string): exec | undefined {
    const factory = this.context.commandRegistry.get(commandName);
    if (!factory) return undefined;
    return factory();
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

  public completions(expression: string): string[] {
    const commands = expression.trim().split("|");
    const latestIncompleteCommand = commands.pop() || "";
    const [exec, args] = this.getArgs(latestIncompleteCommand);
    // check registry for the command
    const command = this.context.commandRegistry.get(exec);
    if (!command) {
      return this.getRegisteredCommands().filter((command) =>
        command.startsWith(latestIncompleteCommand),
      );
    }
    return command().completion(args.split(" "));
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
      const commandClass = currentCommand();

      commandClass.setTerminalContext(this.context);
      commandClass.stdin = response.stdout();
      response = commandClass.run(args.split(" "));
    }

    return response;
  }
}
