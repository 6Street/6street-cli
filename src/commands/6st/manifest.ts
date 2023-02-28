//import * as os from 'os';
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
// const messages = Messages.loadMessages('@6street/6street-cli', 'org');

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
    }),
  };

  // Set this to true if your command requires a project workspace; 'requiresProject' is false by default
  protected static requiresProject = true;

  public async run(): Promise<AnyJson> {
    if (this.hasUncommittedChanges()) {
      throw new SfError('This folder has uncommitted changes - please commit before running this');
    }

    const currentBranch = this.getCurrentBranch();

    let outputFolder = this.flags.output;
    if (outputFolder === './manifest') {
      const branchPath = currentBranch.split('/');
      outputFolder += '/' + branchPath[branchPath.length - 1];
    }
    if (!fs.existsSync(outputFolder)) {
      fs.mkdirSync(outputFolder);
    }

    this.ux.startSpinner(`Finding common ancestor commit for ${currentBranch}...`);
    let fromCommit = this.flags.source ?? (await this.getSourceCommit(currentBranch));
    this.ux.stopSpinner();

    this.ux.startSpinner(`Calculating difference between HEAD and detected common ancestor: ${fromCommit}...`);
    try {
      await sgd({
        to: 'HEAD', // commit sha to where the diff is done. [default : "HEAD"]
        from: fromCommit, // (required) commit sha from where the diff is done. [default : git rev-list --max-parents=0 HEAD]
        output: outputFolder, // source package specific output. [default : "./output"]
        //   apiVersion: 'latest', // salesforce API version. [default : latest]
        repo: '.', // git repository location. [default : "."]
        source: '.',
      });
    } catch (err) {
      throw new SfError('error getting diff: ' + err);
    }
    this.ux.stopSpinner();
    this.ux.log(`Manifest data written to ${outputFolder}.`);

    this.cleanupFiles(outputFolder);

    this.ux.styledHeader(`Manifest data is available in ${outputFolder}`);

    // @TODO: Handle the /profiles?
    // @TODO Output a .csv based on the package.xml for easy paste into the deployment doc?

    // Return an object to be displayed with --json
    return {};
  }

  private getSourceCommit(currentBranch: string): any {
    const commands = [
      'git show-branch -a', //  Get git branch
      "grep '*'",
      `grep -v "${currentBranch}"`,
      'head -n1',
      "sed 's/.*\\[\\(.*\\)\\].*/\\1/'",
      "sed 's/[\\^~].*//'",
    ];

    const sourceBranch = execSync(commands.join(' | '), { stdio: [null, 'pipe', 'pipe'] })
      .toString()
      .trim();

    const sourceCommit = execSync(`git merge-base ${sourceBranch} ${currentBranch}`);
    return sourceCommit.toString().trim();
  }

  private hasUncommittedChanges(): boolean {
    const matchingLines = execSync(`git status --untracked-files=no --porcelain | wc -l`).toString();
    return parseInt(matchingLines) > 0;
  }

  private getCurrentBranch(): string {
    try {
      let currentBranch = execSync(`git symbolic-ref --short HEAD`).toString().trim();
      this.ux.styledHeader(`Current branch detected: ${currentBranch}`);
      return currentBranch;
    } catch (err) {
      throw new SfError('error getting branch name: ' + err);
    }
  }

  private cleanupFiles(outputFolder) {
    this.ux.log(`Cleaning up ${outputFolder}...`);

    const oldPackageFolder = outputFolder + '/package';
    const oldFile = oldPackageFolder + '/package.xml';
    const newFile = outputFolder + '/package.xml';

    // Clean up package.xml into the root of the outputFolder
    fs.renameSync(oldFile, newFile);
    fs.rmSync(oldPackageFolder, { recursive: true });

    // Also remove the entire destructiveChanges folder if we don't actually have anything
    const destructiveChangeFolder = outputFolder + '/destructiveChanges';
    const destructiveChangesFile = fs.readFileSync(`${destructiveChangeFolder}/destructiveChanges.xml`);
    if (!destructiveChangesFile.includes('<types>')) {
      this.ux.log(`No destructive changes found. Suppressing output...`);
      fs.rmSync(`${destructiveChangeFolder}`, { recursive: true });
    }
  }
}
