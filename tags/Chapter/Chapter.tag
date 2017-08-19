<app-chapter>
    <app-header></app-header>
    <div class="content">
        <div class="current">
            <div if="{ chapter.Chapter_id != null }">
                <input type="button" value="Lire le chapitre précédent" onclick="{ showPrevious }">
            </div>
            <div>
                <h1>{ chapter.name }</h1>
                <span>
                    { chapter.username }
                </span>
            </div>
            <div if="{ next != null }">
                <input type="button" value="Lire la suite" onclick="{ showNext }">
            </div>
        </div>
        <div>
            <p>
                { chapter.content }
            </p>
        </div>
        <div class="next">
            <div if="{ next != null }">
                <div>{ next.name }</div>
                <span>
                    { next.username }
                </span>
                <div>
                    <input type="button" value="Lire la suite" onclick="{ showNext }">
                </div>
            </div>
            <div if="{ next == null }">
                <input type="button" value="Ecrire la suite" onclick="{ createNext }">
            </div>

        </div>
    </div>
    <app-footer></app-footer>

    <script>
        var tag = this;

        tag.chapter = null;
        tag.next = null;

        tag.on("before-mount", function()
        {
            tag.chapter = Adapter.adaptChapter(tag.opts.chapter);
            tag.next = tag.opts.next;
            if(tag.chapter == null)
                throw new Error("Chapter cant be null.");
        });

        tag.createNext = function()
        {
            route("/chapter/add/"+tag.chapter.id);
        };

        tag.showNext = function()
        {
            if(tag.next == null)
                return;
            route("/chapter/"+tag.next.id);
        };

        tag.showPrevious = function()
        {
            if(tag.chapter.Chapter_id == null)
                return;
            route("/chapter/"+tag.chapter.Chapter_id);
        };



    </script>
</app-chapter>