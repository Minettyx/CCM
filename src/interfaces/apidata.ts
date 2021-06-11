export interface IManga {
  id: number
  title: string
  author: string
  artist: string
  status: number
  cover: string
  chapters: IChapter[]
}

export interface IChapter {
  chapter: string
  manga: IManga
  title: string
  volume: string
  time: Date
  webtoon: boolean
  images: string[]
}