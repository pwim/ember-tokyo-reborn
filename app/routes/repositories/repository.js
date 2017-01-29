import Ember from 'ember';

export default Ember.Route.extend({
  ajax: Ember.inject.service(),

  model(params) {
    let parentModel = this.modelFor('repositories');
    let repo = parentModel.findBy('name', params.name);
    let repoUrl = `https://api.github.com/repos/${repo.owner.login}/${repo.name}`;
    return this.get('ajax').request(repoUrl);
  },
});
