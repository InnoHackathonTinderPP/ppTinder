Accounts.onCreateUser((options, user) => {
	if (user.services.github) {
		user.username = user.services.github.username;
		user.email = user.services.github.email;
		user.profile = options.profile;
		// fetch guthub data .then(update data in Meteor.users)
	}
	return user;
});