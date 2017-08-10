class App
{
    public static Address : string = "http://localhost:8080/API";


    private static Page = null;
    private static PopUp = null;




    public static request(address, data, redirect = true)
    {
        return new Promise(function(resolve, reject)
        {
            var href=window.location.href;
            if(data == null)
                data = {};
            var request = ajax({
                method : "POST",
                url : address,
                "data" : data
            });
            App.showLoading();
            request.then(function(response)
            {
                App.hideLoading();
                if(App.checkPage(href) == false)
                {
                    reject(ErrorHandler.State.FATAL);
                    return;
                }
                if(address.indexOf(App.Address) == -1)
                {
                    resolve(response);
                    return;
                }
                try
                {
                    ErrorHandler.GetInstance().handle(response);
                    resolve(response);
                }
                catch(error)
                {
                    if(error.name == ErrorHandler.State.FATAL)
                    {
                        if(redirect)
                        {
                            var message = encodeURI(error.message);
                            reject(ErrorHandler.State.FATAL);
                            route("/error/"+message);
                            console.error(error.message);
                        }
                        else 
                        {
                            ErrorHandler.alertIfError(error);
                        }
                    }
                    else 
                        reject(error);
                }
            });

            request.catch(function(error)
            {
                App.hideLoading();
                if(App.checkPage(href) == false)
                {
                    reject(ErrorHandler.State.FATAL);
                    return;
                }
                var message = encodeURI("Une erreur réseau a eu lieu. Vérifiez votre connexion et réessayez.");
                reject(ErrorHandler.State.FATAL);
                route("/error/"+message);
            });
        });
    }

    public static checkPage(page)
    {
        if(window.location.href != page)
            return false;
        return true;
    }


    public static changePage(tag, data)
    {
        if(App.Page != null)
        {
            App.Page.forEach(function(t)
            {
                t.unmount();
            });
            var e = document.createElement("div");
            e.id = "app";
            document.body.appendChild(e);
        }
        App.hideLoading();
        App.Page = riot.mount("div#app", tag, data);
    }

    public static showPopUp(tag, title, data)
    {
        if(App.PopUp != null)
        {
            App.PopUp.forEach(function(t)
            {
                t.unmount();
            });
            if(document.querySelector("div#popup") != null)
                document.querySelector("div#popup").remove();
        }
        var e = document.createElement("div");
        e.id = "popup";
        e.setAttribute("data-name", title);
        var d = document.createElement("div");
        e.appendChild(d);
        var close = document.createElement("div");
        close.className="close";
        close.innerHTML = "🞩";
        e.appendChild(close);
        close.addEventListener("click", App.hidePopUp);
        document.body.appendChild(e);
        App.PopUp = riot.mount(d, tag, data);
        return App.PopUp;
    }

    public static hidePopUp()
    {
        if(App.PopUp != null)
        {
            App.PopUp.forEach(function(t)
            {
                t.unmount();
            });
            if(document.querySelector("div#popup") != null)
                document.querySelector("div#popup").remove();
        }
    }

    public static showLoading()
    {
        if(document.getElementById("loading") != null)
            return;
        var e = document.createElement("div");
        e.id = "loading";
        document.body.appendChild(e);
    }

    public static hideLoading()
    {
        var e = document.getElementById("loading");
        if(e == null)
            return;
        e.remove();
    }

}

