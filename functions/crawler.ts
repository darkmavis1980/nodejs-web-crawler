import { OutgoingHttpHeaders } from 'http';
import { APIGatewayEvent, Context } from 'aws-lambda';
import axios from 'axios';
import * as cheerio from 'cheerio';

interface LambdaResponse {
  statusCode: number;
  headers: OutgoingHttpHeaders;
  body: string;
}

interface Link {
  text: string;
  link: string | undefined;
}

export const webCrawler = async (event: APIGatewayEvent, context: Context) => {
  const headers: OutgoingHttpHeaders = {
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Allow-Origin': '*', // Required for CORS support to work
    'Access-Control-Allow-Methods': 'GET',
    'Access-Control-Allow-Credentials': 'true', // Required for cookies, authorization headers with HTTPS
  };

  const { queryStringParameters } = event;
  const url: string | undefined = queryStringParameters?.url;

  if (!url) {
    throw new Error('Missing url');
  }
  const { data } = await axios.get(url);

  const $ = cheerio.load(data);
  const paragraphs = $('p');
  const paragraphs_list: Array<string> = [];

  for (let i = 0; i < paragraphs.length; i++) {
    const paragraph = $(paragraphs[i]);
    const text = paragraph.text();
    if (text !== '') {
      paragraphs_list.push(text);
    }
  }

  const raw_content = $.text();
  const links = $('a');

  const links_list: Array<Link> = [];

  for (let i = 0; i < links.length; i++) {
    const link: Link = {
      text: $(links[i]).text(),
      link: $(links[i]).attr('href'),
    }

    if (link.text !== '') {
      links_list.push(link);
    }
  }


  let response: LambdaResponse;

  try {
    response = {
      statusCode: 200,
      headers,
      body: JSON.stringify({
        url,
        links: links_list,
        raw_content,
        paragraphs: paragraphs_list,
      })
    };
    return response;
  } catch (error) {
    response = {
      statusCode: 500,
      headers,
      body: JSON.stringify({ message: 'Something went wrong.' })
    };
    return response;
  }
};