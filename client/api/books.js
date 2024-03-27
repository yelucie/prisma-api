const graphqlEndpoint = "http://localhost:4000";

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
  book(id:"${id}){
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
      console.error("Error:", error);
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
      return data.data.books;
    } catch (error) {
      console.error("Error:", error);
      throw error;
    }
  },
};

module.exports = api;
