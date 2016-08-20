/**
 * Created by Almaz on 20.08.2016.
 */
Template.matches.helpers({
    messages: function () {
        var chatId = 1;
        var user = Meteor.user();
        var chatMessages = ChatMessages.find({chatId: chatId}).fetch();
        var messages = [];
        for(var i=0; i< chatMessages.length; i++){
            var message = {};
            var author = Meteor.users.findOne({_id:  chatMessages[i]['userId']});
            message['authorName'] = author.username;
            message['isMine'] = user._id == author._id;
            message['createdTime'] = chatMessages[i]['createdTime'];
            message['avatar'] = author.profile.avatar;
            message['text'] = chatMessages[i]['text'];
            messages.push(message);
        }
        return messages;
    }
});
Template.matches.events(
    {
        'click #sendBtn': function (event) {
            var message = $("#messageArea").val();
            ChatMessages.insert({'text': message, userId: Meteor.userId(), createdTime: new Date(), chatId: 1});
        },

        'submit .chat__controls': (event) => {
            event.preventDefault();
        }
    }
);