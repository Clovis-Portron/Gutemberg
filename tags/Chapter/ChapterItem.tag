<app-chapteritem>
    <div>
        <h1>{ chapter.name }</h1>
        <div>
            <p>
                { chapter.resume }
            </p>
        </div>
        <div>
            <input type="submit" value="Lire l'histoire" onclick="{ showChapter }">
        </div>
    </div>

    <script>
        var tag = this;

        tag.chapter = null;

        tag.on("before-mount", function()
        {
            tag.chapter = Adapter.adaptChapter(tag.opts.chapter);
            if(tag.chapter == null)
                throw new Error("Chapter cant be null.");
        });

        tag.showChapter = function()
        {
            route("/chapter/"+tag.chapter.id);
        }
    </script>
</app-chapteritem>