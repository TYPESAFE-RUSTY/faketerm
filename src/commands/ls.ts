import { exec } from "../command.js";
import { commandOutput, ExitCode } from "../commandOutput.js";
import { FileNodeType, type FileNode } from "../fileSystem.js";
import mri from "mri";

interface LsOptions {
  long: boolean; // display extended file metadata as a table.
  all: boolean; // show hidden and dot files.
  recurse: boolean; // should recurse into directories.
  tree: boolean; // should recurse as tree into directories.
}

export class ls extends exec {
  options: LsOptions = {
    long: false,
    all: false,
    recurse: false,
    tree: false,
  };
  private recursePadding = "   ";
  private treePadding = "──";

  parse(args: string[]): void {
    const opt = mri(args, {
      alias: {
        l: "long",
        a: "all",
        r: "recurse",
        t: "tree",
      },
      default: {
        ...this.options,
      },
    });

    // ignoring positional / extra args for now ;(
    // if (opt._ || !expected) {
    //   // todo!("throw parse errors");
    //   // got positional arg or unexpected args
    // }

    this.options.long = opt.long;
    this.options.all = opt.all;
    this.options.recurse = opt.recurse;
    this.options.tree = opt.tree;
  }

  /**
   * Finds all the child files of the nodeRef param,
   * ignores files with no name by default.
   *
   * files with no names are considered if all option is set to true.
   * @param nodeRef
   * @returns array of childern files
   */
  private getFiles(nodeRef: FileNode): FileNode[] {
    return nodeRef.nodes.filter((node) => {
      if (node.type !== FileNodeType.file) return false;
      if (!this.options.all && !node.name) return false;
      return true;
    });
  }

  private getIconFromExt(extension: string): string {
    switch (extension) {
      case "json":
        return "";
      case "md":
        return "";
      default:
        return "";
    }
  }

  private getDisplayNameForFile(
    node: FileNode,
    prepend: string = "",
    trailingNewline: boolean = true,
  ): string {
    const icon = this.getIconFromExt(node.ext || "");
    const name = node.name ? node.name : "";
    const ext = node.ext ? "." + node.ext : "";
    const trail = trailingNewline ? "\n" : "";
    const extraSpace = this.options.tree ? " " : "";
    return `${prepend}${extraSpace}${icon} ${name}${ext}${trail}`;
  }

  /**
   * Finds all the child directories of the nodeRef param,
   * ignores dirs with no name by default.
   *
   * dirs with no names are considered if all option is set to true.
   * @param nodeRef
   * @returns array of children directories
   */
  private getDirs(nodeRef: FileNode): FileNode[] {
    return nodeRef.nodes.filter((node) => {
      if (node.type !== FileNodeType.directory) return false;
      if (!this.options.all && !node.name) return false;
      return true;
    });
  }

  private getDisplayNameForDir(
    node: FileNode,
    prepend: string = "",
    trailingNewline: boolean = true,
  ): string {
    const extraSpace = this.options.tree ? " " : "";
    return `${prepend}${extraSpace} ${node.name ? node.name : ""}${trailingNewline && "\n"}`;
  }

  /**
   *  only used when recurse option is set to true
   */
  private padding(): string {
    if (this.options.tree) return this.treePadding;
    return this.recursePadding;
  }

  /**
   * choses decorator from following options : <space> ├ │ └
   * @param diff set to value of remaining nodes
   * @param currentActive set to true when getting for files/folders
   * @returns one of the tree decorators
   */
  private getTreeDecorator(
    diff: number,
    currentActive: boolean = false,
  ): string {
    if (!this.options.tree) return "";
    // currently inactive
    if (!currentActive) {
      if (diff <= 0) return " ";
      return "│";
    } else {
      if (diff === 0) return "└";
      return "├";
    }
  }

  private traverse(
    currentNodeRef: FileNode,
    depth: number = 0,
    padding: string = "",
  ) {
    const dirs = this.getDirs(currentNodeRef);
    const files = this.getFiles(currentNodeRef);
    let stdout: string = "";
    let remainingCount = dirs.length + files.length; // this will be used to decide between <space> ├ │ └

    // iterate over the dirs and recurse if needed.
    stdout += dirs
      .sort((a, b) => (a.name + "").localeCompare(b.name))
      .map((node) => {
        // handle for tree (higher priority)
        // T_T idk how to handle this without this if statement.
        if (this.options.tree) {
          remainingCount--;
          const treeDecorator = this.getTreeDecorator(remainingCount, true);
          let res = this.getDisplayNameForDir(
            node,
            `${padding}${treeDecorator + this.padding()}`,
          );

          let currPadding =
            this.getTreeDecorator(remainingCount) + this.recursePadding;

          res += this.traverse(node, depth + 1, padding + currPadding);
          return res;
        }

        let res =
          this.padding().repeat(depth.valueOf()) +
          this.getDisplayNameForDir(node);
        // recurse without symbols
        if (this.options.recurse) {
          res += this.traverse(node, depth + 1);
        }
        return res;
      })
      .join("");

    // iterate over files and append.
    stdout += files
      .sort((a, b) => (a.name + "").localeCompare(b.name))
      .map((node) => {
        if (this.options.tree) {
          remainingCount--;
          const treeDecorator = this.getTreeDecorator(remainingCount, true);
          let res = this.getDisplayNameForFile(
            node,
            `${padding}${treeDecorator + this.padding()}`,
          );
          return res;
        }

        return (
          this.padding().repeat(depth.valueOf()) +
          this.getDisplayNameForFile(node)
        );
      })
      .join("");
    return stdout;
  }

  run(): commandOutput {
    const stdout = `${this.options.tree ? ".\n" : ""}${this.traverse(this.context.currentNodeRef)}`;
    return new commandOutput(ExitCode.EXIT_SUCCESS, stdout);
  }

  man(): string {
    return `
NAME
      ls - list directory contents

SYNOPSIS
      ls [OPTION]...

DESCRIPTION
      List information about the FILEs.

      -a    do not ignore entries starting with .

      -l    use a long listing format

      -r    list subdirectories recursively

      -t    recurse as tree inside directories

  Exit status:
      EXIT_SUCCESS      if OK,
      EXIT_FAILURE      otherwise

AUTHOR
      Written by TypesafeRusty.

INSPIRATION
      ls from GNU coreutils and eza (a modern replacement for ls).
`;
  }
}
