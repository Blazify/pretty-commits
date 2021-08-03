#!/usr/bin/env node

import { exec } from "child_process";
import { exit } from "process";
import { input } from "./input";

interface Types {
  types: { [key: string]: Type };
}

interface Type {
  description: string;
  title: string;
}

const { types }: Types = require("../types.json");
const keys = Object.keys(types);

for (const type in types) {
  const { title, description } = types[type];
  console.log(
    `${keys.indexOf(type) + 1}. ${type}: ${title} -> ${description}\n`
  );
}

(async () => {
  const type = parseInt(await input("Which commit type to use?: "));
  if (type < 0 || type > keys.length - 1) {
    console.error("Invalid commit type!");
    exit(1);
  }

  const commit = keys[type - 1];
  const message = commit + (await input(`${commit}`));
  if (!message.includes(":")) {
    console.error("Error: Commit Message must contain ':'");
    exit(1);
  }

  exec(`git add .; git commit -m "${message}"`, (error, stdout, stderr) => {
    if (error) {
      console.error(`Git error: ${error}`);
      exit(1);
    }
    console.log(stdout);
    console.error(stderr);
  });
})();
