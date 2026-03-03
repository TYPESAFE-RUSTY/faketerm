# faketerm

> I was waiting for someone to build something similar guess i don't have to wait now T_T

todo!("Remember to add a good description here");

## example usage
### node
```JS

// Example: Interactive Node.js REPL with faketerm
const { fakeTerminal } = require("faketerm");
const fsData = require("../vfileSystem.json"); // Your VFS seed data
const prompt = require("prompt-sync")({ sigint: true });

// Initialize the terminal
const terminal = new fakeTerminal();
terminal.parseFS(JSON.stringify(fsData)); // Load virtual FS (async if faketerm grows)
terminal.setUser("typesafeRusty");

// Main REPL loop
console.log(
  "Welcome to FakeTerminal! Type 'man [command]' for help or 'exit' to quit.\n",
);
while (true) {
  const cwd = terminal.runCommand("pwd").stdout().trim();
  process.stdout.write(`[ ${cwd} ]\n`);

  const input = prompt().trim(); // Get and trim user input
  if (!input || input === "exit" || input === "quit") {
    console.log("Goodbye!");
    break;
  }

  const result = terminal.runCommand(input);
  if (result.exitCode() !== 0) {
    console.error(`Error: ${result.stderr().trim()}`);
    continue;
  }

  const output = result.stdout().trim();
  if (output) {
    console.log(output);
  }
}
```

### vanilla
```JS
// use with caution this code is ai generated. (probably the only ai generated section besides package.json's keywords and description)
  import "./style.css";
  import { ExitCode, fakeTerminal } from "faketerm";
  import data from "./constants.json";
  
  const form = document.querySelector("form");
  const input = document.querySelector("input");
  const resultSection = document.querySelector("#results");
  
  const terminal = new fakeTerminal();
  terminal.parseFS(JSON.stringify(data));
  terminal.setUser("Guest");
  terminal.setShellName("bash clone");
  
  // Completion state
  let completions: string[] = [];
  let currentIndex = -1;
  let isCycling = false;
  
  input?.addEventListener("keydown", (e) => {
    if (!input) return;
  
    if (e.key === "Tab") {
      e.preventDefault();
  
      const value = input.value;
      const tokens = value.split(" ");
      const lastToken = tokens[tokens.length - 1];
  
      if (!isCycling) {
        // First Tab press → get completions
        completions = terminal.completions(value);
  
        if (completions.length === 0) return;
  
        if (completions.length === 1) {
          // Only one completion → replace last token and done
          tokens.pop();
          tokens.push(completions[0]);
          input.value = tokens.join(" ");
          return;
        } else {
          // Multiple completions → start cycling
          currentIndex = 0;
          tokens.pop();
          tokens.push(completions[currentIndex]);
          input.value = tokens.join(" ");
          isCycling = true;
          return;
        }
      } else {
        // Already cycling → move to next completion
        currentIndex = (currentIndex + 1) % completions.length;
        tokens.pop();
        tokens.push(completions[currentIndex]);
        input.value = tokens.join(" ");
      }
    } else {
      // Any other key → reset cycling
      isCycling = false;
      completions = [];
      currentIndex = -1;
    }
  });
  
  form?.addEventListener("submit", (e) => {
    e.preventDefault();
    if (!input || !resultSection) return;
  
    if (input.value === "clear") {
      resultSection.innerHTML = "";
      input.value = "";
      return;
    }
  
    const result = terminal.runCommand(input.value);
    const decoratedResult = `<div>${terminal.getPresentWorkingDirectory()}</div>
      ${
        result.exitCode() === ExitCode.EXIT_SUCCESS
          ? `<pre>${result.stdout()}</pre>`
          : `<p>${result.stderr()}</p>`
      }`;
  
    resultSection.innerHTML += decoratedResult;
    input.value = "";
  
    // reset completions after executing command
    isCycling = false;
    completions = [];
    currentIndex = -1;
  });
```

## gotcha's

- [ ] commands implemented here are generous (do not fail if unnecessary args are passed)

## pro's 

- command completions

> list of implemented commands

- [x] ls
- [x] cd
- [x] pwd
- [x] whoami
- [x] echo
- [x] man
- [x] cat
- [x] touch
- [x] rm
- [x] mkdir
- [x] rmdir
- [ ] figlet

## future plans
- implement raw mode or something similar
- implement async api
