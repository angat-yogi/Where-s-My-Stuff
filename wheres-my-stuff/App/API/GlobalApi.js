import { request, gql, GraphQLClient } from "graphql-request";

const URL =
  "https://api-us-west-2.hygraph.com/v2/clspbrpww0ftj01w713oecr6o/master";
const graphQLClient = new GraphQLClient(URL, {
  headers: {
    authorization: `Bearer eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCIsImtpZCI6ImdjbXMtbWFpbi1wcm9kdWN0aW9uIn0.eyJ2ZXJzaW9uIjozLCJpYXQiOjE3MDgyMDkyMjAsImF1ZCI6WyJodHRwczovL2FwaS11cy13ZXN0LTIuaHlncmFwaC5jb20vdjIvY2xzcGJycHd3MGZ0ajAxdzcxM29lY3I2by9tYXN0ZXIiLCJtYW5hZ2VtZW50LW5leHQuZ3JhcGhjbXMuY29tIl0sImlzcyI6Imh0dHBzOi8vbWFuYWdlbWVudC11cy13ZXN0LTIuaHlncmFwaC5jb20vIiwic3ViIjoiZjY5YTk2NjgtNmJkZC00NzRiLWJiNzAtODYyMzA4NzUwNWE1IiwianRpIjoiY2xzcW5ueTExMGFldTAxbjVnZzJ0Mm44MyJ9.kYgGs1UpRYp0PwJ4_dic6JIZXnr8TxHLKjFilz78OC2eiiBhbwPR6OUzPjRq4v7WSSjrqzVBYSuOSbFIIr9XSAhnky3CE04CeakL79BPovHEi8UedDWXKxcnkKVLryJLkfAAPxLOypBzeWZC9m-Brw6DLRXLS4sxjr1nLxjGfggN4X0_WxT7o3t0F3GVhUZKnsFKGr-S-flOtrgGBmXVJnNRuv2bsICBB0YB4HCvC0zdz6eTeFpSpCxL8ujVTc5spA5o-U-2zIGfUUXrSAhgciiwCT1_EIjcI5jxXWrhvup2nPW8fbnW64-bBgeADdz8S6y88P71vtbTcFna-V4EYqgFRjIOtYtvkzRH4MMq6q6FR6xOiiRDFu8ty5kinqrAHwKZdsIICtgVbJWDRqHOiCHEJxwV7EChGZaPER5aSBUzOkRgBXyL0fFW4U-hbeAMqptsL3t_GEaKj8Eg98p9qHzVpeIw3P2xgELtCB32PAjrlmNObvBt0gbPPXNE68yirWFbO71_pb_KAyZk_bfC_NurP21-HSvsDch7yDiK859AVsARkw8CzxpJusNpiM8H4ymaVH71WfJ2-Dg8H09a3TuPYsTk_bZTaI3om4ZkFNvOUIYVcAJGHRRr1SnxMI3gumx3DSObEVfoloMbPVqrSBjOoO00sn-crg_pwAHCTFc`,
  },
});
const getCategories = async () => {
  let result;
  const query = gql`
    query GetCategories {
      categories {
        id
        name
        displayImage {
          url
        }
      }
    }
  `;

  try {
    result = await graphQLClient.request(query);
  } catch (error) {
    console.log("error on api:", error);
  }
  return result;
};
const getTrendingFashions = async () => {
  let result;
  const query = gql`
    query GetTrendingFashions {
      trendingFashions {
        id
        name
        noOfClicks
        image {
          url
        }
      }
    }
  `;
  try {
    result = await graphQLClient.request(query);
  } catch (error) {
    console.log("error on api:", error);
  }
  return result;
};

export default {
  getCategories,
  getTrendingFashions,
};
