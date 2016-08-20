Session.set('currentSuggestedUser', null);

const getCurrentSuggestedUser = () => {
    var suggested = Meteor.users.find({ _id: { $ne: Meteor.user._id }}).fetch();

    Session.set('currentSuggestedUser', _.sample(suggested));
};
//
//Template.main.rendered = function() {
//    getCurrentSuggestedUser();
//};

Template.main.helpers({
    users: () => {
        return Meteor.users.find().fetch();
    },
    currentSuggestUser: () => {
        Session.get('currentSuggestedUser') || getCurrentSuggestedUser();
        return Session.get('currentSuggestedUser');
    }
});

Template.main.events({
    "click .btn__yes": (e) => {
        console.log(123);
        getCurrentSuggestedUser();
    }
});
