import { Octokit } from '@octokit/rest';
import { REGISTRY_CONFIG } from './config';
import { PluginMetadata } from '../types';
import chalk from 'chalk';

export class GithubRegistry {
  private octokit: Octokit;

  constructor() {
    this.octokit = new Octokit({
      auth: REGISTRY_CONFIG.githubToken
    });
  }

  async getPluginMetadata(owner: string, repo: string): Promise<PluginMetadata | null> {
    try {
      // First check if repo exists
      await this.octokit.rest.repos.get({
        owner,
        repo
      });

      const { data } = await this.octokit.rest.repos.getContent({
        owner,
        repo,
        path: REGISTRY_CONFIG.pluginMetadataFile,
      });

      if ('content' in data) {
        const content = Buffer.from(data.content, 'base64').toString();
        return JSON.parse(content);
      }
      console.error(chalk.red(`\n❌ Error: Repository ${owner}/${repo} does not contain a valid ${REGISTRY_CONFIG.pluginMetadataFile} file`));
      return null;
    } catch (error: any) {
      if (error.status === 404) {
        if (error.message.includes('Not Found')) {
          console.error(chalk.red(`\n❌ Error: Repository ${owner}/${repo} not found`));
          console.error(chalk.dim('Please check if the repository exists and you have access to it.'));
        } else {
          console.error(chalk.red(`\n❌ Error: ${REGISTRY_CONFIG.pluginMetadataFile} not found`));
          console.error(chalk.dim(`Make sure ${owner}/${repo} is a valid Nom plugin repository.`));
        }
      } else {
        console.error(chalk.red(`\n❌ Error: ${error.message}`));
      }
      return null;
    }
  }

  async downloadPlugin(owner: string, repo: string, version: string): Promise<Uint8Array | null> {
    try {
      const { data } = await this.octokit.rest.repos.getReleaseByTag({
        owner,
        repo,
        tag: version,
      });

      const asset = data.assets.find(a => a.name === REGISTRY_CONFIG.pluginFileName);
      if (!asset) {
        console.error(chalk.red(`\n❌ Error: Release ${version} does not contain ${REGISTRY_CONFIG.pluginFileName}`));
        return null;
      }

      const response = await fetch(asset.browser_download_url);
      if (!response.ok) {
        console.error(chalk.red(`\n❌ Error: Failed to download plugin: ${response.statusText}`));
        return null;
      }

      const arrayBuffer = await response.arrayBuffer();
      return new Uint8Array(arrayBuffer);
    } catch (error: any) {
      if (error.status === 404) {
        console.error(chalk.red(`\n❌ Error: Release version ${version} not found in ${owner}/${repo}`));
        console.error(chalk.dim('Make sure the release exists and includes a plugin.wasm file.'));
      } else {
        console.error(chalk.red(`\n❌ Error: Failed to download plugin`));
        console.error(chalk.dim(error.message));
      }
      return null;
    }
  }

  parsePluginIdentifier(identifier: string): { owner: string; repo: string } {
    // Remove any leading '@' or 'github:' prefix
    const cleanId = identifier.replace(/^(@|github:)/, '');
    const parts = cleanId.split('/');
    
    if (parts.length < 2) {
      console.error(chalk.red('\n❌ Error: Invalid plugin identifier format'));
      console.error(chalk.dim('Use one of these formats:'));
      console.error(chalk.dim('  - @owner/repo'));
      console.error(chalk.dim('  - github:owner/repo'));
      console.error(chalk.dim('  - owner/repo'));
      throw new Error('Invalid plugin identifier');
    }
    
    return {
      owner: parts[0],
      repo: parts[1]
    };
  }
}