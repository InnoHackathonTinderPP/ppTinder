Router.route('/', function () {
    this.render('main');
    //if (this.ready()) {
    //} else {
    //    this.render('loading');
    //}
});

Router.route('/matches/:chatId', function () {
    Session.set('currentChatId', this.params.chatId);
    this.render('matches');
    //if (this.ready()) {
    //} else {
    //    this.render('loading');
    //}
});


Router.route('/backdoor', function () {
   this.render('backdoor');
});

Router.route('/logout', function () {
  Meteor.logout(() => {
    this.redirect('/');
  });
	this.next();
});