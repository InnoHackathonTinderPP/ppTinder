/**
 * Created by Almaz on 20.08.2016.
 */
Template.chat.helpers({
    messages: function () {
        return ChatMessages.find();
    }
});

Template.chat.events(
    {
        'click #sendBtn': function (event) {
            var message = $("#messageArea").val();
            ChatMessages.insert({'message': message});
            message = "";
        },

        'submit .chat__controls': (event) => {
            event.preventDefault();
        }
    }
)