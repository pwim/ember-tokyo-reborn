import Ember from 'ember';

export default Ember.Route.extend({
  ajax: Ember.inject.service(),

  model() {
    let repo = this.modelFor('repositories.repository');
    return new Ember.RSVP.Promise((resolve, reject) => {
      let repoUrl = `https://api.github.com/repos/${repo.owner.login}/${repo.name}`;
      let commitsUrl = `${repoUrl}/commits`;
      let recentCommits = [];
      this.get('ajax').request(commitsUrl).then((commits) => {
        Ember.RSVP.all(commits.slice(0, 5).map((commit) => {
          return this.get('ajax').request(`${commitsUrl}/${commit.sha}`).then((data) => {
            recentCommits.push(data);
          });
        })).then(() =>{
          resolve({repo, commits, recentCommits});
        }).catch((error) => reject(error));
      }).catch((error) => reject(error));
    });
  }
});
