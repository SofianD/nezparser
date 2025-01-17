#!/usr/bin/env node
/* eslint-disable no-restricted-syntax */

const nezbold = require('nezbold');

const nezparser = {
  args: null,
  options: null,
  commands: null,

  setup(options) {
    this.usage = options.usage;
    this.options = options.options;
    this.commands = options.commands;
  },

  parse() {
    this.args = process.argv.slice(2);

    if (this.args.length === 1 && this.args[0] === 'help') {
      this.help();
    }
  },

  on(command) {
    if (!this.args || this.args[0] === 'help') {
      return {
        so: () => ({
          failed: () => false,
        }),
      };
    }

    if (this.args[0] === command) {
      return {
        so: (cb) => {
          cb();
          return {
            failed: () => false,
          };
        },
      };
    }

    return {
      so: () => ({
        failed: () => ({
          message: `Command not found: ${this.args.join(' ')}`,
        }),
      }),
    };
  },

  help() {
    const usage = this.usage ? `Usage: ${this.usage} \r\n` : '';
    let optionsToString = '';
    for (const option of this.options) {
      optionsToString += `\n  ${option.alias}, ${option.name}, ${option.description}\r`;
    }
    const options = this.options ? `Options: ${optionsToString}` : '';
    let commandsToString = '';
    for (const command of this.commands) {
      commandsToString += `${command === this.commands[0] ? '\n' : '\n\n'}  ${nezbold.bold(command.name)} ${command.description} `;
      if (command.options) {
        let commandOptionsToString = '';
        for (const option of command.options) {
          let spaces = '';
          // eslint-disable-next-line no-return-assign
          Array.from(command.name).map(() => spaces += ' ');
          commandOptionsToString += `\n${spaces}${option.alias}, ${option.name}, ${option.description}\r`;
        }
        commandsToString += commandOptionsToString ? `  ${commandOptionsToString}` : '';
      }
    }
    const commands = this.commands ? `\nCommands: \n${commandsToString}` : '';
    console.log(usage);
    console.log(options);
    console.log(commands);
    process.exit();
  },

  hasOption(name, alias) {
    for (const arg of this.args) {
      if (arg.replace('--', '') === name || arg.replace('-') === alias) {
        return true;
      }
    }
    return false;
  },
};

module.exports = nezparser;
