import { makeExecutableSchema } from '@graphql-tools/schema'
import { context } from './context'

export const typeDefs = `
  type Author {
    id: ID!
    firstname: String
    lastname: String
    country: String
    books: [Book]
  }
 
  type Book {
    id: ID!
    title: String
    description: String
    authors: [Author]
    genres: [Genre]
  }

  type Genre {
    id: ID!
    label: String
    books: [Book]
  }

  type BookGenre {
    book: [Book]
    genre: [Genre]
  }

  type BookAuthor {
    book: [Book]
    author: [Author]
  }
 
  type Query {
    books: [Book]
    authors: [Author]
    genres: [Genre]
    book_genres: [BookGenre]
    book_authors: [BookAuthor]
    author(id: ID!): Author
    book(id: ID!): Book
    genre(id: ID!): Genre
    book_genre(book_id: ID!, genre_id: ID!): BookGenre
    book_author(book_id: ID!, author_id: ID!): BookAuthor
  }
 
  type Mutation {
    createBook(title: String!, description: String): Book
    createAuthor(firstname: String, lastname: String, country: String): Author
    createGenre(label: String): Genre
    deleteBook(id: ID!): Book
    deleteAuthor(id: ID!): Author
    deleteGenre(id: ID!): Genre
    updateBook(id: ID!, title: String, description: String): Book
    updateAuthor(id: ID!, firstname: String, lastname: String, country: String): Author
    updateGenre(id: ID!, label: String): Genre
  }
`

export const resolvers = {
  Query: {
    authors: async () => {
      return context.prisma.author.findMany();
    },
    books: async () => {
      return context.prisma.book.findMany();
    },
    genres: async () => {
      return context.prisma.genre.findMany();
    },
    author: async (_: any, { id }: any) => {
      return context.prisma.author.findUnique({
        where: { id },
      });
    },
    book: async (_: any, { id }: any) => {
      return context.prisma.book.findUnique({
        where: { id },
      });
    },
    genre: async (_: any, { id }: any) => {
      return context.prisma.genre.findUnique({
        where: { id },
      });
    },
    book_genres: async () => {
      return context.prisma.book_genre.findMany({
        include: {
          book: {},
          genre: {},
        }
      });
    },
    book_authors: async () => {
      return context.prisma.book_author.findMany({
        include: {
          book: {},
          author: {},
        }
      });
    },
  },

  Mutation: {
    createAuthor: async (_: any, { firstname, lastname, country }: any) => {
      return context.prisma.author.create({
        data: {
          firstname,
          lastname,
          country,
        },
      });
    },
    createBook: async (_: any, { title, description }: any) => {
      return context.prisma.book.create({
        data: {
          title,
          description,
        },
      });
    },
    createGenre: async (_: any, { label }: any) => {
      return context.prisma.genre.create({
        data: {
          label,
        },
      });
    },
    deleteAuthor: async (_: any, { id }: any) => {
      return context.prisma.author.delete({
        where: { id },
      });
    },
    deleteBook: async (_: any, { id }: any) => {
      return context.prisma.book.delete({
        where: { id },
      });
    },
    deleteGenre: async (_: any, { id }: any) => {
      return context.prisma.genre.delete({
        where: { id },
      });
    },
    updateBook: async (_: any, { id, title, description }: any) => {
      return context.prisma.book.update({
        where: { id },
        data: {
          title,
          description,
        },
      });
    },
    updateAuthor: async (_: any, { id, firstname, lastname, country }: any) => {
      return context.prisma.author.update({
        where: { id },
        data: {
          firstname,
          lastname,
          country,
        },
      });
    },
    updateGenre: async (_: any, { id, label }: any) => {
      return context.prisma.genre.update({
        where: { id },
        data: {
          label,
        },
      });
    },
  },
  Author: {
    books: async (parent: { id: any; }) => {
      return context.prisma.book_author.findMany({
        where: { author_id: parent.id },
      })
        .then((bookAuthors: any[]) => {
          const bookIds = bookAuthors.map((ba: { book_id: any; }) => ba.book_id);
          return context.prisma.book.findMany({
            where: { id: { in: bookIds } },
          });
        });
    },
  },
  Book: {
    authors: async (parent: { id: any; }) => {
      return context.prisma.book_author
        .findMany({
          where: { book_id: parent.id },
        })
        .then((bookAuthors: any[]) => {
          const authorIds = bookAuthors.map((ba: { author_id: any; }) => ba.author_id);
          return context.prisma.author.findMany({
            where: { id: { in: authorIds } },
          });
        });
    },
    genres: async (parent: { id: any; }) => {
      return context.prisma.book_genre
        .findMany({
          where: { book_id: parent.id },
        })
        .then((bookGenres: any[]) => {
          const genreIds = bookGenres.map((bg: { genre_id: any; }) => bg.genre_id);
          return context.prisma.genre.findMany({
            where: { id: { in: genreIds } },
          });
        });
    },

  },
  Genre: {
    books: async (parent: { id: any; }) => {
      return context.prisma.book_genre
        .findMany({
          where: { genre_id: parent.id },
        })
        .then((bookGenres: any[]) => {
          const bookIds = bookGenres.map((bg: { book_id: any; }) => bg.book_id);
          return context.prisma.book.findMany({
            where: { id: { in: bookIds } },
          });
        });
    },
  },
};

export const schema = makeExecutableSchema({ typeDefs, resolvers });