const GITHUB_API = 'https://api.github.com';
const APP_NAME = 'ppTinder';

// Meteor.users.remove({username: 'ariser'});

function githubAPICall(url, token) {
	const options = {};
	options.headers = {
		//'Accept':        'application/vnd.github.v3+json',
		'User-Agent':    APP_NAME,
		//'Authorization': `token ${token}`
	};
	console.log(GITHUB_API + url);
	console.log(options);
	return HTTP.get(GITHUB_API + url, options);
}

Accounts.onCreateUser((options, user) => {
	if (user.services.github) {
		user.username = user.services.github.username;
		user.email = user.services.github.email;
		user.profile = options.profile;

		const token = user.services.github.accessToken;
		var result = githubAPICall(`/users/${user.services.github.username}`, token);
		var githubUserData = result.data;
		user.profile.avatar = githubUserData.avatar_url;
		user.profile.githubdata = githubUserData;
	}
	return user;
});