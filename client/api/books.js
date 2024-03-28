var dotenv = require("dotenv");
dotenv.config();

const graphqlEndpoint = process.env.GRAPHQL_ENDPOINT;

const findAllQuery = `
  query Books {
    books {
      id,
      title,
      description,
    }
  }
`;

const findByIdQuery = (id) => `
  query{
    book(id:"${id}"){
      id,
      title,
      description
      authors {
        firstname
        lastname
      }
      genres {
          label
      }
    }
  }
`;

const createQuery = (book) => `
mutation CreateBook {
  createBook(title: "${book.title}", description: "${book.description}") {
    id,
    title,
    description
  }
}
`;

const deleteByIdQuery = (id) => `
mutation DeleteBook {
  deleteBook(id: "${id}"){
    id,
    title,
    description
  }
}
`;

const updateQuery = (book) => `
mutation UpdateBook {
  updateBook(id: "${book.id}", title: "${book.title}", description: "${book.description}") {
    id,
    title,
    description
  }
}
`;

const requestOptions = (graphqlQuery) => ({
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({ query: graphqlQuery }),
});

const api = {
  findAll: async () => {
    try {
      const response = await fetch(
        graphqlEndpoint,
        requestOptions(findAllQuery)
      );
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      const data = await response.json();
      return data.data.books;
    } catch (error) {
      throw error;
    }
  },
  findById: async (id) => {
    try {
      const response = await fetch(graphqlEndpoint, requestOptions(findByIdQuery(id)));
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      const data = await response.json();
      return data.data.book;
    } catch (error) {
      throw error;
    }
  },
  create: async (book) => {
    try {
      const response = await fetch(
        graphqlEndpoint,
        requestOptions(createQuery(book))
      );
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      const data = await response.json();
      return data.data.createBook;
    } catch (error) {
      throw error;
    }
  },
  deleteById: async (id) => {
    try {
      const response = await fetch(
        graphqlEndpoint,
        requestOptions(deleteByIdQuery(id))
      );
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
    } catch (error) {
      throw error;
    }
  },
  update: async (book) => {
    try {
      const response = await fetch(
        graphqlEndpoint,
        requestOptions(updateQuery(book))
      );
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      const data = await response.json();
      return data.data.updateBook;
    } catch (error) {
      throw error;
    }
  },
};

module.exports = api;