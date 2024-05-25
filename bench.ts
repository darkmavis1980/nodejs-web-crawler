import * as dotenv from "dotenv";
dotenv.config();

const urls: string[] = [
  'https://www.hubspot.com',
  'https://www.hubspot.com/pricing',
  'https://www.hubspot.com/our-story',
  'https://www.hubspot.com/products/crm',
  'https://www.hubspot.com/products/marketing',
  'https://www.hubspot.com/products/sales',
  'https://www.hubspot.com/products/service',
  'https://www.hubspot.com/products/cms',
  'https://www.hubspot.com/products/operations',
  'https://www.hubspot.com/products/conversations',
  'https://www.hubspot.com/products/automation',
];

const {
  API_URL,
} = process.env;

const fetchUrls = async (urls: string[]) => {
  try {
    if (!API_URL) {
      throw new Error('Missing API endpoint');
    }

    console.info(`Fetching from ${API_URL}`)
    let start = Date.now();
    await Promise.all(urls.map(async (url) => {
      const response = await fetch(`${API_URL}?url=${url}`);
      await response.json();
    }));
    let timeTaken = Date.now() - start;
    console.log("Total time taken : " + timeTaken + " milliseconds");
  } catch (error) {
    if (error instanceof Error) {
      console.error(error.message);
    }
    console.error(error);
  }
};

fetchUrls(urls);