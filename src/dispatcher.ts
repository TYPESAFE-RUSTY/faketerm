import { exec } from "./command.js";
import { ls } from "./commands/ls.js";
import { cd } from "./commands/cd.js";
import { pwd } from "./commands/pwd.js";
import { whoami } from "./commands/whoami.js";
import { echo } from "./commands/echo.js";
import { man } from "./commands/man.js";
import { cat } from "./commands/cat.js";
import { touch } from "./commands/touch.js";
import { rm } from "./commands/rm.js";
import { mkdir } from "./commands/mkdir.js";
import { rmdir } from "./commands/rmdir.js";

// todo!("move to terminal class as a hashmap")
export function getExec(command: string): exec | null {
  // this limits the implementation of alias command ;( for now
  switch (command) {
    case "ls":
      return new ls();
    case "cd":
      return new cd();
    case "pwd":
      return new pwd();
    case "whoami":
      return new whoami();
    case "echo":
      return new echo();
    case "man":
      return new man();
    case "cat":
      return new cat();
    case "touch":
      return new touch();
    case "rm":
      return new rm();
    case "mkdir":
      return new mkdir();
    case "rmdir":
      return new rmdir();
    default:
      return null;
  }
}
