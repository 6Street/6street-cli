// import * as os from 'os';
import * as fs from 'fs';
import { execSync } from 'child_process';

import { flags, SfdxCommand } from '@salesforce/command';
import { Messages, SfError } from '@salesforce/core';
import { AnyJson } from '@salesforce/ts-types';

import sgd from 'sfdx-git-delta';

// Initialize Messages with the current plugin directory
Messages.importMessagesDirectory(__dirname);

// Load the specific messages for this file. Messages from @salesforce/command, @salesforce/core,
// or any library that is using the messages framework can also be loaded this way.
const messages = Messages.loadMessages('@6street/6street-cli', 'org');

export default class Manifest extends SfdxCommand {
  public static description = `generates a package.xml manifest based on git changes made in a branch.`;
  public static examples = [`$  sfdx 6st:manifest`];

  public static args = [{ name: 'file' }];

  protected static flagsConfig = {
    force: flags.boolean({
      char: 'f',
      description: 'overwrites an existing package.xml in the manifest folder if it exists',
    }),
    // flag with a value (-n, --name=VALUE)
    output: flags.string({
      char: 'o',
      description: 'Selected output folder for the manifest file',
      default: './manifest',
    }),
    source: flags.string({
      char: 's',
      description: "Branch or commit we're comparing to for the diff",
      default: 'develop',
    }),
  };

  // Comment this out if your command does not require an org username
  //   protected static requiresUsername = true;

  // Comment this out if your command does not support a hub org username
  //   protected static supportsDevhubUsername = true;

  // Set this to true if your command requires a project workspace; 'requiresProject' is false by default
  protected static requiresProject = true;

  public async run(): Promise<AnyJson> {
    // Organization will always return one result, but this is an example of throwing an error
    // The output and --json will automatically be handled for you.
    if (false) {
      throw new SfError(messages.getMessage('errorNoOrgResults', [this.org.getOrgId()]));
    }

    const currentBranch = this.getCurrentBranch();
    this.ux.log(`Current branch ${currentBranch}`);

    // Does the folder for output exist?
    // Do we have to make it?
    // Do we overwrite the exiting file?
    let outputFolder = this.flags.output;
    if (outputFolder === './manifest') {
      const branchPath = currentBranch.split('/');
      outputFolder += '/' + branchPath[branchPath.length - 1];
    }
    if (!fs.existsSync(outputFolder)) {
      fs.mkdirSync(outputFolder);
    }
    this.ux.log(`Writing to ` + outputFolder);

    // this.ux.startSpinner('Looking for changes inside this branch...');
    let forkPoint = this.getForkPoint(this.flags.source);

    this.ux.log(`Calculating difference between HEAD and ${forkPoint}...`);
    const work = await sgd({
      to: 'HEAD', // commit sha to where the diff is done. [default : "HEAD"]
      from: forkPoint.trim(), // (required) commit sha from where the diff is done. [default : git rev-list --max-parents=0 HEAD]
      output: outputFolder, // source package specific output. [default : "./output"]
      //   apiVersion: 'latest', // salesforce API version. [default : latest]
      repo: '.', // git repository location. [default : "."]
      source: '.',
    });
    // Handle the /profiles garbage?
    // Output a .csv for easy paste into the deployment doc?

    this.ux.styledJSON(work);

    // if (this.flags.force && this.args.file) {
    //   this.ux.log(`You input --force and a file: ${this.args.file as string}`);
    // }

    // Return an object to be displayed with --json
    return {};
  }

  private getForkPoint(branch: string): string {
    return execSync(`git merge-base --fork-point ${branch}`).toString();
  }

  private getCurrentBranch(): string {
    try {
      let currentBranch = execSync(`git symbolic-ref --short HEAD`).toString().trim();
      this.ux.log(`Current branch ${currentBranch}`);
      return currentBranch;
    } catch (err) {
      throw new SfError('error getting branch name: ' + err);
    }
  }
}
