/**
 * Created by Almaz on 20.08.2016.
 */
Template.matches.helpers({
    messages: function () {
        var chatId = Session.get('currentChatId');
        var user = Meteor.user();
        var chatMessages = ChatMessages.find({ chatId }).fetch();

        return chatMessages.map((message) => {
            var author = Meteor.users.findOne({ _id: message.userId });
            return {
                authorName: author.username,
                isMine: user._id === author._id,
                createdTime: message.createdTime,
                avatar: author.profile.avatar,
                text: message.text
            };
        });
    }
});

Template.matches.events(
    {
        'click #sendBtn': function (event) {
            var message = $("#messageArea").val();

            ChatMessages.insert({
                'text': message,
                userId: Meteor.userId(),
                createdTime: new Date(),
                chatId: Session.get('currentChatId')});
        },

        'submit .chat__controls': (event) => {
            event.preventDefault();
        }
    }
);
