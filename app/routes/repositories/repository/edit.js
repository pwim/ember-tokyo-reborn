import Ember from 'ember';

export default Ember.Route.extend({
  actions: {
    cancel() {
      this.transitionTo(
        'repositories.repository',
        this.get('controller.model.name')
      );
    }
  }
});
