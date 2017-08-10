class Adapter {
}
class ErrorHandler {
    static GetInstance() {
        return ErrorHandler.Instance;
    }
    handle(response) {
        if (response.state == "OK")
            return;
        var error = new Error();
        switch (response.data) {
            case 0:
                error.message = "Vos informations de connexion ne sont pas valides.";
                error.name = ErrorHandler.State.FATAL;
                break;
            case 1:
                error.message = "Vous n'avez pas les droits suffisants.";
                error.name = ErrorHandler.State.FATAL;
                break;
            case "23000":
            case 23000:
                error = this.handleSQL(response);
                break;
            case "105":
            case 105:
                error.message = "Une valeur requise est manquante. Veuillez vérifier le formulaire.";
                error.name = ErrorHandler.State.ERROR;
                break;
            case 101:
                var length = response.message.split(" than ")[1].split("\n\n#0")[0];
                error.message = "Une valeur est en dessous de la longueur requise de " + length + " caractères. Veuillez vérifier le formulaire.";
                error.name = ErrorHandler.State.ERROR;
                break;
            default:
                error.name = ErrorHandler.State.ERROR;
                error.message = "Ooops... Quelque chose s'est mal passé. Veuillez réessayer plus tard.";
                break;
        }
        throw error;
    }
    handleSQL(response) {
        var error = new Error();
        // gestion de l'unicité 
        if (response.message.indexOf(" 1062 ") != -1) {
            var value = response.message.split("Duplicate entry '")[1].split("' for key ")[0];
            error.message = "La valeur " + value + " transmise existe déjà dans la base de données. Veuillez corriger le formulaire.";
            error.name = ErrorHandler.State.ERROR;
        }
        return error;
    }
    static alertIfError(error) {
        if (error instanceof Error)
            alert(error.message);
    }
    static diagnosticForm(formname, errors) {
        console.log(errors);
        for (var field in errors[formname]) {
            var nodes = document.getElementsByName(field);
            if (nodes.length <= 0)
                continue;
            var node = (nodes[0]);
            node.classList.add("error");
            node.addEventListener("focus", function (e) {
                e.target.classList.remove("error");
            });
            node.addEventListener("click", function (e) {
                e.target.classList.remove("error");
            });
        }
    }
}
ErrorHandler.State = {
    INFO: "INFO",
    ERROR: "ERROR",
    FATAL: "FATAL"
};
ErrorHandler.Instance = new ErrorHandler();
class App {
    static request(address, data, redirect = true) {
        return new Promise(function (resolve, reject) {
            var href = window.location.href;
            if (data == null)
                data = {};
            var request = ajax({
                method: "POST",
                url: address,
                "data": data
            });
            App.showLoading();
            request.then(function (response) {
                App.hideLoading();
                if (App.checkPage(href) == false) {
                    reject(ErrorHandler.State.FATAL);
                    return;
                }
                if (address.indexOf(App.Address) == -1) {
                    resolve(response);
                    return;
                }
                try {
                    ErrorHandler.GetInstance().handle(response);
                    resolve(response);
                }
                catch (error) {
                    if (error.name == ErrorHandler.State.FATAL) {
                        if (redirect) {
                            var message = encodeURI(error.message);
                            reject(ErrorHandler.State.FATAL);
                            route("/error/" + message);
                            console.error(error.message);
                        }
                        else {
                            ErrorHandler.alertIfError(error);
                        }
                    }
                    else
                        reject(error);
                }
            });
            request.catch(function (error) {
                App.hideLoading();
                if (App.checkPage(href) == false) {
                    reject(ErrorHandler.State.FATAL);
                    return;
                }
                var message = encodeURI("Une erreur réseau a eu lieu. Vérifiez votre connexion et réessayez.");
                reject(ErrorHandler.State.FATAL);
                route("/error/" + message);
            });
        });
    }
    static checkPage(page) {
        if (window.location.href != page)
            return false;
        return true;
    }
    static changePage(tag, data) {
        if (App.Page != null) {
            App.Page.forEach(function (t) {
                t.unmount();
            });
            var e = document.createElement("div");
            e.id = "app";
            document.body.appendChild(e);
        }
        App.hideLoading();
        App.Page = riot.mount("div#app", tag, data);
    }
    static showPopUp(tag, title, data) {
        if (App.PopUp != null) {
            App.PopUp.forEach(function (t) {
                t.unmount();
            });
            if (document.querySelector("div#popup") != null)
                document.querySelector("div#popup").remove();
        }
        var e = document.createElement("div");
        e.id = "popup";
        e.setAttribute("data-name", title);
        var d = document.createElement("div");
        e.appendChild(d);
        var close = document.createElement("div");
        close.className = "close";
        close.innerHTML = "🞩";
        e.appendChild(close);
        close.addEventListener("click", App.hidePopUp);
        document.body.appendChild(e);
        App.PopUp = riot.mount(d, tag, data);
        return App.PopUp;
    }
    static hidePopUp() {
        if (App.PopUp != null) {
            App.PopUp.forEach(function (t) {
                t.unmount();
            });
            if (document.querySelector("div#popup") != null)
                document.querySelector("div#popup").remove();
        }
    }
    static showLoading() {
        if (document.getElementById("loading") != null)
            return;
        var e = document.createElement("div");
        e.id = "loading";
        document.body.appendChild(e);
    }
    static hideLoading() {
        var e = document.getElementById("loading");
        if (e == null)
            return;
        e.remove();
    }
}
App.Address = "http://localhost:8080/API";
App.Page = null;
App.PopUp = null;
/**
 * Created by clovis on 10/08/17.
 */
class Router {
    constructor() {
        this.setRoutes();
    }
    static GetInstance() {
        return Router.Instance;
    }
    start() {
        route.start(true);
    }
    addChapter() {
        App.changePage("app-chapteredit", {
            "chapter": {}
        });
    }
    addChapterAfter(id) {
        App.changePage("app-chapteredit", {
            "chapter": { "Chapter_id": id }
        });
    }
    editChapter(id) {
        var request = App.request(App.Address + "/getchapter", {
            "id": id
        });
        request.then(function (response) {
            App.changePage("app-chapteredit", {
                "chapter": response.data
            });
        });
        request.catch(function (error) {
            if (error instanceof Error)
                route("/error/" + error.message);
        });
    }
    error(message) {
        message = decodeURI(message);
        App.changePage("app-error", {
            "message": message
        });
    }
    setRoutes() {
        let self = this;
        route("/chapter/add/*", self.addChapterAfter);
        route("/chapter/add", self.addChapter);
        route("/chapter/edit/*", self.editChapter);
        route("/error/*", self.error);
        route("/error", self.error);
    }
}
Router.Instance = new Router();
//# sourceMappingURL=global.js.map