<app-chapter>
    <app-header></app-header>
    <div >
        <div class="current">
            <div >
                <input if="{ chapter.Chapter_id != null }" type="button" value="Précédent" onclick="{ showPrevious }">
            </div>
            <div>
                <h1>{ chapter.name }</h1>
                <span>
                    { chapter.username }
                </span>
            </div>
            <div >
                <input if="{ next != null }" type="button" value="Suivant" onclick="{ showNext }">
            </div>
        </div>
        <div>
            <p ref="content">
            </p>
        </div>
        <div class="next" if="{ next != null }">
            <h1>Chapitre suivant:</h1>
            <app-chapteritem chapter="{ next }"></app-chapteritem>
        </div>
        <div class="next" if="{ next == null }">
            <h1>L'histoire s'arrete la pour le moment</h1>
            <input type="button" value="Ecrire la suite" onclick="{ createNext }">
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

        tag.on("mount", function()
        {
            tag.refs.content.innerHTML = tag.chapter.content;
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