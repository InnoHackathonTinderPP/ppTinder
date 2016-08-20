const CURRENT_SUGGESTED_USER_KEY = 'currentSuggestedUser';

const MATCH_SCHEME = {
	userId:   '',
	accepted: [],
	rejected: []
};

const CHAT_SCHEME = {
	users: []
};

const CHAT_IS_CREATED_KEY = 'chatIsCreated';

const IS_SUGGESTIONS_EMPTY_KEY = 'isSuggestionsEmpty';

Session.set(CURRENT_SUGGESTED_USER_KEY, null);
Session.set(IS_SUGGESTIONS_EMPTY_KEY, false);

function updateCurrentSuggestedUserForUser(currentUserId) {
	var currentUserMatches = getMatchObjectForUser(currentUserId);
	var suggested = Meteor.users.find({_id: {$nin: [Meteor.user()._id, ...currentUserMatches.rejected, ...currentUserMatches.accepted]}}).fetch();
	if (!suggested.length) {
		console.log("You're loser");
		Session.set(IS_SUGGESTIONS_EMPTY_KEY, true);
	} else {
		Session.set(CURRENT_SUGGESTED_USER_KEY, _.sample(suggested));
	}
}

function acceptUser(currentUserId, acceptedUserId) {
	var currentUserMatches = getMatchObjectForUser(currentUserId);
	if (!_.contains(currentUserMatches.accepted, acceptedUserId)) {
		currentUserMatches.accepted.push(acceptedUserId);
	}
	Matches.update(currentUserMatches._id, currentUserMatches);

	tryCreateChat(currentUserId, acceptedUserId);
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

function tryCreateChat(currentUserId, otherUserId) {
	const currentUserMatches = getMatchObjectForUser(currentUserId);
	const otherUserMatches = getMatchObjectForUser(otherUserId);
	if (_.contains(currentUserMatches.accepted, otherUserId) && _.contains(otherUserMatches.accepted, currentUserId)) {
		Chats.insert(_.defaults({users: [currentUserId, otherUserId]}, CHAT_SCHEME));
		Session.set(CHAT_IS_CREATED_KEY, true);
		return true;
	}
	return false;
}

//
//Template.main.rendered = function() {
//    getCurrentSuggestedUser();
//};

Template.main.helpers({
	users:                       () => {
		return Meteor.users.find().fetch();
	},
	currentSuggestUser:          () => {
		if (!Session.get(CURRENT_SUGGESTED_USER_KEY)) {
			updateCurrentSuggestedUserForUser(Meteor.userId());
		}
		return Session.get(CURRENT_SUGGESTED_USER_KEY);
	},
	currentSuggestUserLanguages: () => {
		if (!Session.get(CURRENT_SUGGESTED_USER_KEY)) {
			return '';
		}
		return Session.get(CURRENT_SUGGESTED_USER_KEY).profile.repos_langs.join(', ');
	},
	showNotification:            () => Session.get(CHAT_IS_CREATED_KEY),
	isSuggestionsEmpty:          () => Session.get(IS_SUGGESTIONS_EMPTY_KEY),
	chatsCount:                  () => Chats.find({users: {$in: [Meteor.user()._id]}}).count()
});

Template.main.events({
	"click #answer_yes": () => {
		acceptUser(Meteor.userId(), Session.get(CURRENT_SUGGESTED_USER_KEY)._id);
		updateCurrentSuggestedUserForUser(Meteor.userId());
	},
	'click #answer_no':  () => {
		rejectUser(Meteor.userId(), Session.get(CURRENT_SUGGESTED_USER_KEY)._id);
		updateCurrentSuggestedUserForUser(Meteor.userId());
	}
});
