# faketerm

I was waiting for someone to build something similar guess i don't have to wait now T_T

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

### react
```txt
check out my portfolio
```

## gotcha's

- [ ] commands implemented here are generous (do not fail if unnecessary args are passed)

## pro's 

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
- move dispatcher to a registry pattern and allow user to register their own commands
