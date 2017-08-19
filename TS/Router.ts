/**
 * Created by clovis on 10/08/17.
 */
class Router
{
    private static Instance : Router = new Router();

    public static GetInstance() : Router
    {
        return Router.Instance;
    }

    constructor()
    {
        this.setRoutes();
    }

    public start()
    {
        route.start(true);
    }

    private showStories()
    {
        var filters = {
            "Chapter_id" : "null",
            "public" : 1
        };
        var request = App.request(App.Address + "/getchapters", {
            "filters" : JSON.stringify(filters)
        });
        request.then(function(response :any)
        {
            App.changePage("app-stories", {
                "chapters" : response.data
            });
        });
        request.catch(function(error)
        {
            if(error instanceof Error)
                route("/error/"+error.message);
        })
    }

    private showChapter(id)
    {
        var requestChapter = App.request(App.Address + "/getchapter", {
            "id" : id
        });
        var filters = {
            "Chapter_id" : id
        };
        var requestNext = App.request(App.Address + "/getchapters" , {
            "filters" : JSON.stringify(filters)
        });
        var request = Promise.all([requestChapter, requestNext]);
        request.then(function(responses : any)
        {
            var opts : any  = {
                "chapter" : responses[0].data,
                "next" : null
            };
            if(responses[1].data.length > 0)
                opts.next = responses[1].data[0];
            App.changePage("app-chapter", opts);
        });
        request.catch(function(error)
        {
            if(error instanceof Error)
                route("/error/"+error.message);
        });
    }

    private addChapter()
    {
        App.changePage("app-chapteredit", {
            "chapter" : {}
        });
    }

    private addChapterAfter(id : number)
    {
        App.changePage("app-chapteredit", {
            "chapter" : { "Chapter_id" : id}
        });
    }

    private editChapter(id : number)
    {
        var request = App.request(App.Address + "/getchapter", {
            "id" : id
        });
        request.then(function(response : any)
        {
            App.changePage("app-chapteredit", {
                "chapter" : response.data
            });
        });
        request.catch(function(error)
        {
            if(error instanceof Error)
                route("/error/"+error.message);
        });
    }

    private error(message : string)
    {
        message = decodeURI(message);
        App.changePage("app-error", {
            "message" : message
        });
    }


    private setRoutes()
    {

        let self = this;

        route("/stories", self.showStories);

        route("/chapter/add/*", self.addChapterAfter);
        route("/chapter/add", self.addChapter);
        route("/chapter/edit/*", self.editChapter);
        route("/chapter/*", self.showChapter);


        route("/error/*", self.error);
        route("/error", self.error);

    }
}