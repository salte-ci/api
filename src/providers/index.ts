import { GitHubProvider } from './github';
import { GitLabProvider } from './gitlab';
import { BitbucketProvider } from './bitbucket';

export function providers(type: string) {
  switch (type) {
    case 'github': return GitHubProvider;
    case 'gitlab': return GitLabProvider;
    case 'bitbucket': return BitbucketProvider;
    default: throw new Error(`Unknown provider type. (${type})`);
  }
}
