<app-chaptereditform>
    <form name="edit-chapter">
        <div>
            <label>Titre*</label>
            <input type="text" ref="name" name="fullname" value="{chapter.name}">
        </div>
        <div>
            <label>Contenu*</label>
            <textarea ref="content" name="content">{chapter.content}</textarea>
        </div>
        <div>
            <label>Pseudonyme auteur*</label>
            <input type="text" ref="username" name="username" value="{chapter.username}">
        </div>
        <div>
            <label>Email auteur</label>
            <input type="text" ref="mail" name="mail" value="{chapter.mail}">
        </div>
        <div>
            <label>Public</label>
            <input type="checkbox" ref="public" name="public" value="1" checked="{chapter.public !== 0}">
        </div>
        <input type="button" value="Envoyer" onclick="{validate}">
    </form>
    <script>
        var tag = this;

        tag.chapter = null;

        tag.on("before-mount", function()
        {
            tag.chapter = tag.opts.chapter;

            if(tag.chapter === null)
                throw new Error("Chapter cant be null.");
        });

        tag.validate = function()
        {
            var valid = new Validatinator({
                "edit-chapter": {
                    "fullname" : "required|maxLength:400",
                    "content" : "required|minLength: 100|maxLength:9000",
                    "mail" : "maxLength:100",
                    "username" : "required|minLength:5|maxLength:100"
                }
            });
            if (valid.passes("edit-chapter")) {
                tag.send();
            }
            if(valid.fails("edit-chapter"))
            {
                ErrorHandler.diagnosticForm("edit-chapter", valid.errors);
            }
        };

        tag.send = function()
        {
            tag.chapter.name = tag.refs.name.value;
            tag.chapter.content = tag.refs.content.value;
            tag.chapter.username = tag.refs.username.value;
            if(tag.refs.mail.value !== "")
                tag.chapter.mail = tag.refs.mail.value;
            if(tag.refs.public.checked === true)
                tag.chapter.public = 1;
            else
                tag.chapter.public = 0;

            var address = App.Address + "/updatechapter";

            if(tag.chapter.id == null)
                address = App.Address + "/addchapter";


            var request = App.request(address, tag.chapter);
            request.then(function(response)
            {
                route("/chapter/"+response.data);
            });
            request.catch(function(error)
            {
                ErrorHandler.alertIfError(error);
            });

        };

    </script>
</app-chaptereditform>