export enum ExitCode {
  EXIT_SUCCESS = 0,
  EXIT_FAILURE = 1,
}

export class commandOutput {
  private exitCodeVal: ExitCode = ExitCode.EXIT_FAILURE;
  private stdOutStr: string | null = null;
  private stdErrStr: string | null = null;
  constructor(
    exitCode: ExitCode,
    stdout: string | null = null,
    stderr: string | null = null,
  ) {
    this.exitCodeVal = exitCode;
    this.stdOutStr = stdout;
    this.stdErrStr = stderr;
  }

  exitCode(): ExitCode {
    return this.exitCodeVal;
  }
  stdout(): string | null {
    return this.stdOutStr;
  }
  stderr(): string | null {
    return this.stdErrStr;
  }
}
