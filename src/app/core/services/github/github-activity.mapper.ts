import { ModelMapper } from '../../model-mapper';
import { GitHubActivity } from './github-activity';

/*
const expectedResponse = [{
  type: 'PushEvent',
  repo: {id: 1, name: 'user/test-name', url: 'test-repo-api-url'},
  payload: {
    size: 2,
    commits: [
      {message: 'added a test commit'},
      {message: 'added another test commit '}
    ]
  },
  created_at: '2020-05-01T19:29:05Z'
}, {
  type: 'PushEvent',
  repo: {id: 1, name: 'user/test-name', url: 'test-repo-api-url'},
  payload: {
    size: 2,
    commits: [
      {message: 'added a test commit'},
      {message: 'added another test commit '}
    ]
  },
  created_at: '2020-05-01T19:29:05Z'
}];
*/

export class GitHubActivityMapper implements ModelMapper<any, GitHubActivity> {
  public fromResponse(jsonData: any): GitHubActivity {
    return undefined;
  }
}