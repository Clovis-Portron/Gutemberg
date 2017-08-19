class Adapter
{
    public static adaptChapter(chapter : any) : any
    {
        if(chapter.adapted == true)
            return chapter;
        chapter.resume = chapter.content.slice(0, 140);
        chapter.adapted = true;
        return chapter;
    }
}