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
                createdTime: message.createdTime,
                avatar: author.profile.avatar,
                message: message.text
            };
        });
    },
    chats: function() {
        return Chats.find({ users: { $in: [Meteor.user()._id] }});
    }
});

Template.matches.rendered =
    function () {
        var chatId = Session.get('currentChatId');
        var chat = Chats.find({chatId: chatId});
        var user = Meteor.user();
        var author1 = Meteor.users.findOne({_id: chat['users'][0]});
        var author2 = Meteor.users.findOne({_id: chat['users'][1]});
        for (var i = 0; i < 30; i++) {
            var author = author1;
            if (i % 4 < 3) {
                author = author2;
            }
            ChatMessages.insert({
                authorName: author.username,
                isMine: user._id === author._id,
                createdTime: new Date(),
                avatar: author.profile.avatar,
                text: "asdfasdfasdf"
            });
        }
    };

Template.matches.events(
    {
        'click #sendBtn': function (event) {
            var message = $("#message").val();

            ChatMessages.insert({
                text: message,
                userId: Meteor.userId(),
                createdTime: new Date(),
                chatId: Session.get('currentChatId')
            });
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
