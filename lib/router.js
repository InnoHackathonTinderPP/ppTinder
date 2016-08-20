Router.route('/', function () {
    this.render('main');
    //if (this.ready()) {
    //} else {
    //    this.render('loading');
    //}
});

Router.route('/matches', function () {
    this.render('matches');
    //if (this.ready()) {
    //} else {
    //    this.render('loading');
    //}
});

Router.route('/chat', function () {
    this.render('chat');
    //if (this.ready()) {
    //} else {
    //    this.render('loading');
    //}
});

Router.route('/backdoor', function () {
   this.render('backdoor');
});
