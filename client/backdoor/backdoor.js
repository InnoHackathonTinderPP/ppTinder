const RANDOM_ACCOUNTS_NUMBER = 25;

Session.set('spamProgress', 0);

Template.backdoor.helpers({
	spamProgress: () => Session.get('spamProgress'),
	spamTotal: () => RANDOM_ACCOUNTS_NUMBER
});

Template.backdoor.events({
	'click #spam-acc': () => {
		const promises = [];
		Session.set('spamProgress', 0);
		for (let i = 0; i < RANDOM_ACCOUNTS_NUMBER; i++) {
			promises.push(
				HTTP.callPromise('GET', 'https://randomuser.me/api/')
					.then(({data}) => {
						const user = data.results[0];
						Accounts.createUser({
							username: user.login.username,
							email   : user.email,
							password: 'password',
							profile : {
								name: `${user.name.first} ${user.name.last}`,
								avatar: user.picture.large
							},
						});
					})
					.finally(() => {
						Session.set('spamProgress', Session.get('spamProgress') + 1);
					})
			);
		}
	}
});
