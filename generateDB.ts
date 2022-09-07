import { readFileSync, writeFileSync, existsSync, mkdirSync } from 'fs'
import { Chapter, Manga } from './src/types'

if (!existsSync(`./public/api/manga/`)){
    mkdirSync(`./public/api/manga/`, { recursive: true });
}

const chapters: Chapter[] = JSON.parse(readFileSync('./src/db/chapters.json', 'utf8')).map(e => {
    return {
        title: e.title,
        volume: e.volume,
        webtoon: e.webtoon,
        images: e.images,
        chapter: e.chapter,
        manga: e.manga,
        time: new Date(e.time.$date).getTime()
    }
})

const mangas: Manga[] = JSON.parse(readFileSync('./src/db/mangas.json', 'utf8')).map(e => {
    return {
        id: e.id,
        title: e.title,
        author: e.author,
        artist: e.artist || undefined,
        status: parseInt(e.status),
        cover: e.cover
    }
})


// latest

let chapters_order_date = chapters
    .sort((a, b) => (parseInt(b.time) - parseInt(a.time)))
    .slice(0, 20)
    .map(e => {
        let manga_ = mangas.find(v => v.id == e.manga+'')

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
        }
    })

writeFileSync('./public/api/latest.json', JSON.stringify(chapters_order_date))

// mangas

let mangas_file = mangas
    .map(e => {
        return {
            title: e.title,
            cover: e.cover,
            id: e.id
        }
    })
    .sort((a, b) => a.title.localeCompare(b.title))

writeFileSync('./public/api/mangas.json', JSON.stringify(mangas_file))


// manga

for(let manga of mangas) {
    let manga_file = {
        id: manga.id,
        title: manga.title,
        cover: manga.cover,
        status: manga.status,
        author: manga.author,
        artist: manga.artist,
        chapters: chapters.filter(e => e.manga+'' == manga.id).map(e => {
            return {
                chapter: e.chapter,
                volume: e.volume,
                title: e.title,
                time: e.time
            }
        }).sort((a, b) => parseFloat(a.chapter) - parseFloat(b.chapter))
    }

    writeFileSync(`./public/api/manga/${manga_file.id}.json`, JSON.stringify(manga_file))

}

// chapter

for (let ch of chapters) {
    let this_manga = mangas.find(e => e.id == ch.manga+'')

    let chapter_file = {
        chapter: ch.chapter,
        volume: ch.volume,
        title: ch.title,
        manga: {
            id: this_manga.id,
            title: this_manga.title,
            cover: this_manga.cover,
            chapters: chapters.filter(e => e.manga+'' == this_manga.id).map(e => {
                return {
                    chapter: e.chapter,
                    volume: e.volume,
                    title: e.title
                }
            }).sort((a, b) => parseFloat(a.chapter) - parseFloat(b.chapter))
        },
        webtoon: ch.webtoon,
        images: ch.images
    }

    if (!existsSync(`./public/api/chapter/${chapter_file.manga.id}/`)){
        mkdirSync(`./public/api/chapter/${chapter_file.manga.id}/`, { recursive: true });
    }

    writeFileSync(`./public/api/chapter/${chapter_file.manga.id}/${chapter_file.chapter}.json`, JSON.stringify(chapter_file))
}