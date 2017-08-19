<app-stories>
    <app-header></app-header>

    <div class="content">
        <app-chapters chapters="{ chapters }"></app-chapters>
    </div>

    <app-footer></app-footer>
    <script>
        var tag = this;

        tag.chapters = null;

        tag.on("before-mount", function()
        {
            tag.chapters = tag.opts.chapters;
            if(tag.chapters == null)
                throw new Error("Chapters cant be null.");
        });
    </script>
</app-stories>