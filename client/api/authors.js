var dotenv = require("dotenv");
dotenv.config();

const graphqlEndpoint = process.env.GRAPHQL_ENDPOINT;

const findAllQuery = `
query Authors {
  authors {
    id
    firstname
    lastname
    country
  }
}
`;

const findByIdQuery = (id) => `
query{
  author(id:"${id}"){
    id,
    firstname
    lastname
    country
  }
}
`;

const createQuery = (author) => `
mutation CreateAuthor {
  createAuthor(firstname: "${author.firstname}", lastname: "${author.lastname}", country: "${author.country}") {
    id,
    firstname
    lastname
    country
  }
}
`;

const deleteByIdQuery = (id) => `
mutation DeleteAuthor {
  deleteAuthor(id: "${id}"){
    id,
    firstname
    lastname
    country
  }
}
`;

const updateQuery = (author) => `
mutation UpdateAuthor {
  updateAuthor(id: "${author.id}", firstname: "${author.firstname}", lastname: "${author.lastname}", country: "${author.country}") {
    id,
    firstname
    lastname
    country
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
      return data.data.authors;
    } catch (error) {
      throw error;
    }
  },
  findById: async (id) => {
    try {
      const response = await fetch(
        graphqlEndpoint,
        requestOptions(findByIdQuery(id))
      );
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      const data = await response.json();
      return data.data.author;
    } catch (error) {
      throw error;
    }
  },
  create: async (author) => {
    try {
      const response = await fetch(
        graphqlEndpoint,
        requestOptions(createQuery(author))
      );
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      const data = await response.json();
      return data.data.createAuthor;
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
  update: async (author) => {
    try {
      const response = await fetch(
        graphqlEndpoint,
        requestOptions(updateQuery(author))
      );
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      const data = await response.json();
      return data.data.updateAuthor;
    } catch (error) {
      throw error;
    }
  },
};

module.exports = api;
