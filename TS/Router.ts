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

        route("/chapter/add/*", self.addChapterAfter);
        route("/chapter/add", self.addChapter);
        route("/chapter/edit/*", self.editChapter);


        route("/error/*", self.error);
        route("/error", self.error);

    }
}