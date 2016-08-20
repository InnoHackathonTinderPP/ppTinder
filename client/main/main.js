const CURRENT_SUGGESTED_USER_KEY = 'currentSuggestedUser';

const MATCH_SCHEME = {
	userId  : '',
	accepted: [],
	rejected: []
};

Session.set(CURRENT_SUGGESTED_USER_KEY, null);

function updateCurrentSuggestedUserForUser(currentUserId) {
	var currentUserMatches = getMatchObjectForUser(currentUserId);
	var suggested = Meteor.users.find({_id: {$nin: [Meteor.user()._id, ...currentUserMatches.rejected, ...currentUserMatches.accepted]}}).fetch();
	if (!suggested.length) {
		console.log("You're loser");
		Session.set('currentSuggestedUser', {username: 'Noone'});
	} else {
		Session.set('currentSuggestedUser', _.sample(suggested));
	}
}

function acceptUser(currentUserId, acceptedUserId) {
	var currentUserMatches = getMatchObjectForUser(currentUserId);
	if (!_.contains(currentUserMatches.accepted, acceptedUserId)) {
		currentUserMatches.accepted.push(acceptedUserId);
	}
	Matches.update(currentUserMatches._id, currentUserMatches);
}

function rejectUser(currentUserId, rejectedUserId) {
	var currentUserMatches = getMatchObjectForUser(currentUserId);
	if (!_.contains(currentUserMatches.rejected, rejectedUserId)) {
		currentUserMatches.rejected.push(rejectedUserId);
	}
	Matches.update(currentUserMatches._id, currentUserMatches);
}

function getMatchObjectForUser(userId) {
	var matchObject = Matches.findOne({userId});
	if (!matchObject) {
		var matchId = Matches.insert(_.defaults({userId}, MATCH_SCHEME));
		matchObject = Matches.findOne(matchId);
	}
	return matchObject;
}

//
//Template.main.rendered = function() {
//    getCurrentSuggestedUser();
//};

Template.main.helpers({
	users             : () => {
		console.log(Meteor.users.find().fetch());
		return Meteor.users.find().fetch();
	},
	currentSuggestUser: () => {
		if (!Session.get(CURRENT_SUGGESTED_USER_KEY)) {
			updateCurrentSuggestedUserForUser(Meteor.userId());
		}
		return Session.get(CURRENT_SUGGESTED_USER_KEY);
	}
});

Template.main.events({
	"click #answer_yes": () => {
		acceptUser(Meteor.userId(), Session.get(CURRENT_SUGGESTED_USER_KEY)._id);
		updateCurrentSuggestedUserForUser(Meteor.userId());
	},
	'click #answer_no' : () => {
		rejectUser(Meteor.userId(), Session.get(CURRENT_SUGGESTED_USER_KEY)._id);
		updateCurrentSuggestedUserForUser(Meteor.userId());
	}
});
