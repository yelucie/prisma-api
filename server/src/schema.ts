import { makeExecutableSchema } from '@graphql-tools/schema'
import { context } from './context'

export const typeDefs = `
  type Author {
    id: String!
    firstname: String
    lastname: String
    country: String
    books: [Book]
  }
 
  type Book {
    id: String
    title: String
    description: String
    author: Author
    genres: [Genre]
  }

  type Genre {
    id: String
    label: String
    books: [Book]
  }
 
  # the schema allows the following query:
  type Query {
    books: [Book]
    authors: [Author]
    genres: [Genre]
    author(id: String!): Author
    book(id: String!): Book
    genre(id: String!): Genre
  }
 
  # this schema allows the following mutation:
  type Mutation {
    createBook(title: String!, description: String, authorid: String!, genreIds: [String!]): Book
    createAuthor(firstname: String, lastname: String, country: String): Author
    createGenre(label: String): Genre
    deleteBook(id: String!): Book
    deleteAuthor(id: String!): Author
    deleteGenre(id: String!): Genre
    addBookToGenre(bookid: String!, genreId: String!): BookGenre
  }

  type BookGenre {
    book: Book
    genre: Genre
  }
`

export const resolvers = {
  Query: {
    authors: async () => {
      return context.prisma.author.findMany();
    },
    books: async () => {
      return context.prisma.books.findMany();
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
      return context.prisma.books.findUnique({
        where: { id },
      });
    },
    genre: async (_: any, { id }: any) => {
      return context.prisma.genre.findUnique({
        where: { id },
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
    createBook: async (_: any, { title, description, authorId, genreIds }: any) => {
      return context.prisma.books.create({
        data: {
          title,
          description,
          author: { connect: { id: Number(authorId) } },
          book_genre: { connect: genreIds.map((id: any) => ({ id })) },
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
      return context.prisma.books.delete({
        where: { id },
      });
    },
    deleteGenre: async (_: any, { id }: any) => {
      return context.prisma.genre.delete({
        where: { id },
      });
    },
    addBookToGenre: async (_: any, { bookId, genreId }: any) => {
      return context.prisma.book_genre.create({
        data: {
          books: { connect: { id: bookId } },
          genre: { connect: { id: genreId } },
        },
      });
    },
  },
  Author: {
    books: async (parent: { id: any; }) => {
      return context.prisma.books.findMany({
        where: {
          author_id: parent.id,
        },
      });
    },
  },
  Book: {
    author: async (parent: { authorId: any; }) => {
      return context.prisma.author.findUnique({
        where: { id: parent.authorId },
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
          return context.prisma.books.findMany({
            where: { id: { in: bookIds } },
          });
        });
    },
  },
};

export const schema = makeExecutableSchema({ typeDefs, resolvers });