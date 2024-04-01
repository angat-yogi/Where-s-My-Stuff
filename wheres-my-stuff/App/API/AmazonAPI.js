const apiKey = '76d3590a42mshef44616e4a1d8bcp1ffbfbjsnb914dc7b9243';

const fetchAmazonData = async (keyword) => {
  try {
    const response = await fetch(`https://axesso-axesso-amazon-data-service-v1.p.rapidapi.com/amz/amazon-search-by-keyword-asin?domainCode=com&keyword=${keyword}&page=1&excludeSponsored=true`, {
      method: 'GET',
      headers: {
        'X-RapidAPI-Key': apiKey,
        'X-RapidAPI-Host': 'axesso-axesso-amazon-data-service-v1.p.rapidapi.com',
        // 'Content-Type': 'application/json',
      },
    });

    const data = await response.json();
    console.log(data); // This will log the API response to the console
    return data;
  } catch (error) {
    console.error('Error fetching Amazon data:', error);
    throw error;
  }
};
export default {
    fetchAmazonData
}
