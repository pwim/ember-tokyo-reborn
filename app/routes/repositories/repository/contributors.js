import Ember from 'ember';

export default Ember.Route.extend({
  ajax: Ember.inject.service(),

  model() {
    let repo = this.modelFor('repositories.repository');
    let url = `https://api.github.com/repos/${repo.owner.login}/${repo.name}/contributors`;
    return this.get('ajax').request(url);
  }
});
