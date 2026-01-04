import { GraphQLClient } from 'graphql-request';

const endpoint = 'https://graphql.datocms.com/';
const token = import.meta.env.DATOCMS_API_TOKEN;

export const client = new GraphQLClient(endpoint, {
  headers: {
    authorization: `Bearer ${token}`,
  },
});

export interface Article {
  id: string;
  title: string;
  body: {
    value: any;
  };
  cover: {
    url: string;
    alt?: string;
  };
  published: boolean;
  slug: string;
  category?: {
    id: string;
    name: string;
  };
  short: string;
  _createdAt: string;
  date?: string;
}

export interface AllArticlesResponse {
  allArticles: Article[];
}

export interface ArticleResponse {
  article: Article;
}

export const ALL_ARTICLES_QUERY = `
  query AllArticles {
    allArticles(filter: {published: {eq: true}}, orderBy: _createdAt_DESC) {
      id
      title
      slug
      short
      _createdAt
      date
      cover {
        url
        alt
      }
      category {
        id
        name
      }
    }
  }
`;

export const ARTICLE_BY_SLUG_QUERY = `
  query ArticleBySlug($slug: String!) {
    article(filter: {slug: {eq: $slug}}) {
      id
      title
      slug
      short
      _createdAt
      date
      body {
        value
      }
      cover {
        url
        alt
      }
      published
      category {
        id
        name
      }
    }
  }
`;

export async function getAllArticles(): Promise<Article[]> {
  const data = await client.request<AllArticlesResponse>(ALL_ARTICLES_QUERY);
  return data.allArticles;
}

export async function getArticleBySlug(slug: string): Promise<Article | null> {
  const data = await client.request<ArticleResponse>(ARTICLE_BY_SLUG_QUERY, { slug });
  return data.article || null;
}

// Books
export interface Book {
  id: string;
  title: string;
  content: {
    value: any;
  };
  cover: {
    url: string;
    alt?: string;
  };
  amazonUrl: string;
  slug: string;
  brief: string;
}

export interface AllBooksResponse {
  allBooks: Book[];
}

export interface BookResponse {
  book: Book;
}

export const ALL_BOOKS_QUERY = `
  query AllBooks {
    allBooks {
      id
      title
      slug
      brief
      cover {
        url
        alt
      }
      amazonUrl
    }
  }
`;

export const BOOK_BY_SLUG_QUERY = `
  query BookBySlug($slug: String!) {
    book(filter: {slug: {eq: $slug}}) {
      id
      title
      slug
      brief
      content {
        value
      }
      cover {
        url
        alt
      }
      amazonUrl
    }
  }
`;

export async function getAllBooks(): Promise<Book[]> {
  const data = await client.request<AllBooksResponse>(ALL_BOOKS_QUERY);
  return data.allBooks;
}

export async function getBookBySlug(slug: string): Promise<Book | null> {
  const data = await client.request<BookResponse>(BOOK_BY_SLUG_QUERY, { slug });
  return data.book || null;
}

// Various
export interface Various {
  id: string;
  title: string;
  short: string;
  cover: {
    url: string;
    alt?: string;
  };
  content: {
    value: any;
  };
  gallery?: Array<{
    url: string;
    alt?: string;
  }>;
  links?: Array<{
    id: string;
    url: string;
    title?: string;
  }>;
  slug: string;
  _createdAt: string;
  date?: string;
  category?: {
    id: string;
    name: string;
  };
}

export interface AllVariousResponse {
  allGenerics: Various[];
}

export interface VariousResponse {
  generic: Various;
}

export const ALL_VARIOUS_QUERY = `
  query AllVarious {
    allGenerics(orderBy: date_DESC) {
      id
      title
      slug
      short
      _createdAt
      date
      category {
        id
        name
      }
      cover {
        url
        alt
      }
    }
  }
`;

export const VARIOUS_BY_SLUG_QUERY = `
  query VariousBySlug($slug: String!) {
    generic(filter: {slug: {eq: $slug}}) {
      id
      title
      slug
      short
      _createdAt
      date
      category {
        id
        name
      }
      content {
        value
      }
      cover {
        url
        alt
      }
      gallery {
        url
        alt
      }
    }
  }
`;

export async function getAllVarious(): Promise<Various[]> {
  const data = await client.request<AllVariousResponse>(ALL_VARIOUS_QUERY);
  return data.allGenerics;
}

export async function getVariousBySlug(slug: string): Promise<Various | null> {
  const data = await client.request<VariousResponse>(VARIOUS_BY_SLUG_QUERY, { slug });
  return data.generic || null;
}

// About
export interface About {
  id: string;
  about: {
    value: any;
  };
}

export interface AboutResponse {
  about: About;
}

export const ABOUT_QUERY = `
  query About {
    about {
      id
      about {
        value
      }
    }
  }
`;

export async function getAbout(): Promise<About | null> {
  const data = await client.request<AboutResponse>(ABOUT_QUERY);
  return data.about || null;
}
