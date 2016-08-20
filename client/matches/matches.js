/**
 * Created by Almaz on 20.08.2016.
 */
Template.matches.helpers({
    messages: function () {
        var chatId = Session.get('currentChatId');
        var user = Meteor.user();
        var chatMessages = ChatMessages.find({chatId}).fetch();

        return chatMessages.map((message) => {
            var author = Meteor.users.findOne({_id: message.userId});
            return {
                authorName: author.username,
                isMine: user._id === author._id,
                createdTime: moment(message.createdTime).calendar(),
                avatar: author.profile && author.profile.avatar,
                text: message.text
            };
        });
    },
    chats: function() {
        return Chats.find({ users: { $in: [Meteor.user()._id] }});
    }
});
Template.matches.events(
    {
        'click #sendBtn': function (event) {
            var message = $('input[name="message"]').val();
            console.log(message);
            if(message !== "") ChatMessages.insert({
                text: message,
                userId: Meteor.userId(),
                createdTime: new Date(),
                chatId: Session.get('currentChatId')
            });
            $('input[name="message"]').val("");

            let offsetTop = $(".chat .chat__entry:last-child").offset().top + 100000

            $('.chat__console').animate({
                scrollTop: offsetTop
            }, 2000);
        },

        'submit .chat__controls': (event) => {
            event.preventDefault();
        }
    }
);

Template.chatTitle.helpers({
    withWho: function() {
        var users = this.users.filter(userId => {
           return userId != Meteor.user()._id;
        });
        return Meteor.users.findOne(users[0]).username;
    }

});
