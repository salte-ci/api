import { expect } from 'chai';
import { providers } from './index';
import { BitbucketProvider } from './bitbucket';
import { GitHubProvider } from './github';
import { GitLabProvider } from './gitlab';

describe('function(providers)', () => {
  it('should support "bitbucket"', async () => {
    expect(providers('bitbucket')).to.equal(BitbucketProvider);
  });

  it('should support "github"', async () => {
    expect(providers('github')).to.equal(GitHubProvider);
  });

  it('should support "gitlab"', async () => {
    expect(providers('gitlab')).to.equal(GitLabProvider);
  });

  it('should throw an error for unknown providers', async () => {
    expect(() => providers('unknown')).to.throw('Unknown provider type. (unknown)');
  });
});
