<app-header>
    <h1 onclick="{ showStories }">TURN</h1>
    <nav>
        <input type="button" value="+" onclick="{ createStory }">
    </nav>

    <script>
        var tag = this;

        tag.showStories = function()
        {
            route("/stories");
        };

        tag.createStory = function()
        {
            route("/chapter/add");
        }
    </script>
</app-header>