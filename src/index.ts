#!/usr/bin/env node
import { exec } from "child_process";
import { prompt } from "inquirer";
import { exit } from "process";

interface Types {
  types: { [key: string]: Type };
}

interface Type {
  description: string;
  title: string;
}

const { types }: Types = require("../types.json");
const keys = Object.keys(types);

(async () => {
  const { type, scope, msg } = await prompt([
    {
      message: "Commit Type",
      name: "type",
      type: "list",
      choices: keys.map((x) => ({
        name: `${x}: ${types[x].title} -> ${types[x].title}`,
        value: x,
      })),
    },
    {
      message: "Any specific file(s)?. If no, press enter.",
      name: "scope",
      type: "input",
    },
    {
      message: "Commit Message",
      name: "msg",
      type: "input",
    },
  ]);

  const message = `${type}${scope.length > 0 ? `(${scope})` : ""}: ${msg}`;

  exec(`git add .; git commit -m "${message}"`, (error, stdout, stderr) => {
    if (error) {
      console.error(`Git error: ${error}`);
      exit(1);
    }
    if (stdout.length > 0) console.log(stdout);
    if (stderr.length > 0) console.error(stderr);
  });
})();
