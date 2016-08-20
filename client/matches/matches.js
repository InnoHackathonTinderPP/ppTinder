
Template.matches.helpers({
    messages: function () {
        return ChatMessages.find();
    }
});

Template.matches.events(
    {
        'click #sendBtn': function (event) {
            var message = $('input[name="message"]').val();
            if(message !== "") ChatMessages.insert({'message': message});
            $('input[name="message"]').val("");
        },

        'submit .chat__controls': (event) => {
            event.preventDefault()
        }
    }
)