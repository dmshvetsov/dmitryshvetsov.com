+++
title = "Tutorial: run Aptos CLI commands from VSCode with tasks"
date = '2023-09-08'
+++

In this tutorial, you will learn how to streamline the process of running `aptos move` commands without leaving VSCode or touching your mouse which is powerful and fast. I will use Aptos CLI "test" command as an example, and the idea below can be applied to any CLI utility you can imagine.

_Note, this tutorial is written for nix-like operating systems as Linux, Unix, and Mac OS. Although, if you an advance user, you can replicate the below solution on your operating system._

---

Before you start, make sure you have:
- Aptos Move project; you can copy [hello aptos example](https://github.com/dmshvetsov/aptos_hello_blockchain_example) if you don't have one
- installed [Aptos CLI](https://aptos.dev/tools/aptos-cli/install-cli/)
- installed VSCode
- [`make` nix utility](https://www.gnu.org/software/make/), it should already be installed if you are using Linux, Unix, or Mac OS

Add `Makefile` file to the your project root directory.

    $ cd <your move project root directory>

    $ touch Makefile

Open `Makefile` in VSCode or any other text editor of your choice and change the contents of the file to look like this:

```text
test:
	aptos move test --dev --ignore-compile-warnings

```

I assume `Makefile` was completely new and empty, if you had it before with other commands in it, just add/change the test command. Important, make sure that you use tabs for indentation in Makefiles.

By adding the above two lines into a Makefile you created a command `test` that can be invoked with `make` nix utility.

Run this to execute the test command:

    $ make test

It will execute `aptos move test` with two given flags. The `--dev` flag enables dev mode, is a good practice to make it easier to mange address during development ([see docs for --dev flag](https://aptos.dev/move/book/packages/#instantiation)) and `--ignore-compile-warnings` does what it says: it allows you run `test` command even if Move compiler is not completely happy with your code, like unused dependencies and variables.

I find compiling _warnings_ irrelevant during writing Move code. Just like when you write an article or a tweet you don't want to edit a paragrath that you just wrote, you want to be in the flow and switch to editing when you are done writing a solution. I do tidy up the code after I'm happy with the solution but, I do not mix these two activities.

With the Makefile "test" command we've unified the way run our tests for every Move project you have. Imagine, you are prolific Move smart-contract developer and have written dozens of projects. Projects may have their own specifics to for running commands, such as `aptos move test`. Using Makefile "test" command, no matter what project you have, there is consistent way to run that command, regardless how complex or nuanced it is in that concrete project. You just call `make test`. I'd like to see this become a standard when developing with Move.

Next I want to make it even easier for you to run "test" command when working in VSCode. Switching between your editor and CLI terminal is minor, but does distract your development flow. What can you do, is it to use VSCode tasks. VSCode tasks can be called without leaving the editor, by pressing `cmd+shift+p` on Mac OS (and I guess `ctrl+shift+p` on linux, unix like systems) and typing a name of a task to call it.

To do this, you need to add a task to current project list of available tasks.

In the root folder of an Aptos Move project add `tasks.json` file to `.vscode` directory if it does not exist. If `.vscode` directory is missing, create it.

    $ mdkir .vscode

    $ touch .vscode/tasks.json

Then add "test" tasks by adding a JSON object to `task.json` file

```json
{
    // .vscode/task.json file
    "version": "2.0.0",
    "tasks": [
        {
            "label": "test",
            "type": "shell",
            "command": "make test"
        }
    ]
}
```

VSCode "test" task and Makefile "test" command are not the same things. The first one is for the VSCode editor, and the second one is for the `make` CLI utility.

"Label" "test" is the name that you will be able to use from VSCode to invoke the command. "Command" `make test` is exactly the same command that you used earlier to call `aptos move test` with project specific arguments. And "type" `shell` means that task need to invoke command in operating system shell invironment which is equal to terminal commands that you ran many times during this tutorial.

This way we connedted VSCdoe "test" task with Makefile test command.

After all changes you should have similar project structure:

```text
.
├── .vscode/tasks.json    # <- vscode tasks you've added
├── Makefile              # <- Makefile you've added
├── Move.toml
├── README.md
└── sources
    ├── hello_blockchain.move
    └── hello_blockchain_test.move
```

Now you are able to open a command palette in VSCode with `cmd+shift+p` on Mac OS and `ctrl+shift+p` on linux/unix and then type "test" and you should see "Tasks: Run Test Task" in the command palette prompt, hit the enter button and see how tests are ran in VSCode terminal panel.

---

## further reading

- [source code for the tutorial](https://github.com/dmshvetsov/aptos_hello_blockchain_example)
- [learn make in Y minutes](https://learnxinyminutes.com/docs/make/)
- [learn how to develop Move smart-contracts with Overmind community](https://overmind.xyz/?utm_source=magic-dima)
