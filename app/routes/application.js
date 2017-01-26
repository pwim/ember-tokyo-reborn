import Ember from 'ember';

export default Ember.Route.extend({
  model() {
    return new Ember.RSVP.Promise((_, reject) => {
      reject('Error!');
    });
  },

  renderTemplate() {
    this.render('application');
  },
});
