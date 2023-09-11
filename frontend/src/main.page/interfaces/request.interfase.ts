export interface IPagination {
    limit: number,
    offset: number
}

export interface IGetShortUrl {
    originalUrl: string
    subpart?: string
}