"use strict";
exports.__esModule = true;
var fs_1 = require("fs");
var chapters = JSON.parse(fs_1.readFileSync('./src/db/chapters.json', 'utf8')).map(function (e) {
    return {
        title: e.title,
        volume: e.volume,
        webtoon: e.webtoon,
        images: e.images,
        chapter: e.chapter,
        manga: e.manga,
        time: new Date(e.time.$date).getTime()
    };
});
var mangas = JSON.parse(fs_1.readFileSync('./src/db/mangas.json', 'utf8')).map(function (e) {
    return {
        id: e.id,
        title: e.title,
        author: e.author,
        artist: e.artist || undefined,
        status: parseInt(e.status),
        cover: e.cover
    };
});
// latest
var chapters_order_date = chapters
    .sort(function (a, b) { return (parseInt(b.time) - parseInt(a.time)); })
    .slice(0, 20)
    .map(function (e) {
    var manga_ = mangas.find(function (v) { return v.id == e.manga + ''; });
    return {
        chapter: e.chapter,
        volume: e.volume,
        title: e.title,
        time: e.time,
        manga: {
            id: manga_.id,
            title: manga_.title,
            cover: manga_.cover
        }
    };
});
fs_1.writeFileSync('./public/api/latest.json', JSON.stringify(chapters_order_date));
// mangas
var mangas_file = mangas
    .map(function (e) {
    return {
        title: e.title,
        cover: e.cover,
        id: e.id
    };
})
    .sort(function (a, b) { return a.title.localeCompare(b.title); });
fs_1.writeFileSync('./public/api/mangas.json', JSON.stringify(mangas_file));
var _loop_1 = function (manga) {
    var manga_file = {
        id: manga.id,
        title: manga.title,
        cover: manga.cover,
        status: manga.status,
        author: manga.author,
        artist: manga.artist,
        chapters: chapters.filter(function (e) { return e.manga + '' == manga.id; }).map(function (e) {
            return {
                chapter: e.chapter,
                volume: e.volume,
                title: e.title,
                time: e.time
            };
        }).sort(function (a, b) { return parseFloat(a.chapter) - parseFloat(b.chapter); })
    };
    fs_1.writeFileSync("./public/api/manga/" + manga_file.id + ".json", JSON.stringify(manga_file));
};
// manga
for (var _i = 0, mangas_1 = mangas; _i < mangas_1.length; _i++) {
    var manga = mangas_1[_i];
    _loop_1(manga);
}
var _loop_2 = function (ch) {
    var this_manga = mangas.find(function (e) { return e.id == ch.manga + ''; });
    var chapter_file = {
        chapter: ch.chapter,
        volume: ch.volume,
        title: ch.title,
        manga: {
            id: this_manga.id,
            title: this_manga.title,
            cover: this_manga.cover,
            chapters: chapters.filter(function (e) { return e.manga + '' == this_manga.id; }).map(function (e) {
                return {
                    chapter: e.chapter,
                    volume: e.volume,
                    title: e.title
                };
            }).sort(function (a, b) { return parseFloat(a.chapter) - parseFloat(b.chapter); })
        },
        webtoon: ch.webtoon,
        images: ch.images
    };
    if (!fs_1.existsSync("./public/api/chapter/" + chapter_file.manga.id + "/")) {
        fs_1.mkdirSync("./public/api/chapter/" + chapter_file.manga.id + "/", { recursive: true });
    }
    fs_1.writeFileSync("./public/api/chapter/" + chapter_file.manga.id + "/" + chapter_file.chapter + ".json", JSON.stringify(chapter_file));
};
// chapter
for (var _a = 0, chapters_1 = chapters; _a < chapters_1.length; _a++) {
    var ch = chapters_1[_a];
    _loop_2(ch);
}
