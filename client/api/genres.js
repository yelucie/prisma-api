var dotenv = require("dotenv");
dotenv.config();

const graphqlEndpoint = process.env.GRAPHQL_ENDPOINT;

const findAllQuery = `
query Genres {
  genres {
    id
    label
  }
}
`;

const findByIdQuery = (id) => `
query{
  genre(id:"${id}"){
    id,
    label
  }
}
`;

const createQuery = (genre) => `
mutation CreateGenre {
  createAuthor(label: "${genre.label}") {
    id,
    label
  }
}
`;

const deleteByIdQuery = (id) => `
mutation DeleteGenre {
  deleteGenre(id: "${id}"){
    id,
    label
  }
}
`;

const updateQuery = (genre) => `
mutation UpdateGenre {
  updateGenre(id: "${genre.id}", label: "${genre.label}") {
    id,
    label
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
      return data.data.genres;
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
      return data.data.genre;
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
      return data.data.createGenre;
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
      const data = await response.json();
      console.log(data);
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
      return data.data.updateGenre;
    } catch (error) {
      throw error;
    }
  },
};

module.exports = api;
