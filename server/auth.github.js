const GITHUB_API = 'https://api.github.com';
const APP_NAME = 'ppTinder';

// Meteor.users.remove({username: 'ariser'});

function getGitHubApiURL(url) {
	return GITHUB_API + url;
}

function gitHubAPICall(url, token) {
	const options = {};
	options.headers = {
		//'Accept':        'application/vnd.github.v3+json',
		'User-Agent':    APP_NAME,
		'Authorization': `token ${token}`
	};
	console.log(GITHUB_API + url);
	console.log(options);
	return HTTP.get(url, options);
}

Accounts.onCreateUser((options, user) => {
	if (user.services.github) {
		user.username = user.services.github.username;
		user.email = user.services.github.email;
		user.profile = options.profile;

		const token = user.services.github.accessToken;
		var result = gitHubAPICall(getGitHubApiURL(`/users/${user.services.github.username}`), token);
		var gitHubUserData = result.data;
		user.profile.avatar = gitHubUserData.avatar_url;
		user.profile.githubdata = gitHubUserData;

		result = gitHubAPICall(gitHubUserData.repos_url, token);
		var gitHubReposData = result.data;
		user.profile.repos_count = gitHubReposData.length;
		user.profile.stargazers_count = _.reduce(gitHubReposData, (sum, repo) => sum + repo.stargazers_count, 0);

		user.profile.repos_langs = _.compact(_.uniq(_.map(gitHubReposData, repo => repo.language)));
	}
	return user;
});
