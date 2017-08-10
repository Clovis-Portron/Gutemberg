<app-chapteredit>
    <app-header></app-header>
    <app-chaptereditform ref="form" chapter="{chapter}"></app-chaptereditform>
    <app-footer></app-footer>

    <script>
        var tag = this;

        tag.chapter = null;

        tag.on("before-mount", function()
        {
            tag.chapter = tag.opts.chapter;

            if(tag.chapter === null)
                throw new Error("Chapter cant be null");
        });
    </script>
</app-chapteredit>