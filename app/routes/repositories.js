import Ember from 'ember';

export default Ember.Route.extend({
  ajax: Ember.inject.service(),

  model() {
    return this.get('ajax').request('https://api.github.com/orgs/emberjs/repos');
  },

  renderTemplate() {
    this.render();
    this.render('repositories/-repository-list', {
      outlet: 'repository-list',
      into: 'application',
    });
  }

});
