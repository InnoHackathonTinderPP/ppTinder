var Clicks = new Meteor.Collection('clicks');

if (Meteor.isClient) {
  // counter starts at 0
  Template.main.helpers({
      isLoggedIn: function() {
          return Boolean(Meteor.userId());
      }
  });

  Template.main.events({
    'click button': function () {
      // increment the counter when button is clicked
      console.log(123);

      Clicks.insert({ click: 123 });

    }
  });
}

if (Meteor.isServer) {
  Meteor.startup(function () {
    // code to run on server at startup
  });
}
