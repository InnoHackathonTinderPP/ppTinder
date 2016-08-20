var Clicks = new Meteor.Collection('clicks');
if (Meteor.isClient) {
  // counter starts at 0
  Session.setDefault('counter', 0);

  Template.hello.helpers({
    counter: function () {
      return Clicks.find().count();
    }
  });

  Template.hello.events({
    'click button': function () {
      // increment the counter when button is clicked
      console.log(123);
      Clicks.insert({ click: 123 });
      Session.set('counter', Clicks.find().count());
    }
  });
}

if (Meteor.isServer) {
  Meteor.startup(function () {
    // code to run on server at startup
  });
}
