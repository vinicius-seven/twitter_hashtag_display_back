import axios from 'axios';
//@ts-ignore
import client from '../twitter/twitter.ts';

const twApi = axios.create({
  baseURL: 'https://api.twitter.com',
  headers: {
    Authorization: `Bearer AAAAAAAAAAAAAAAAAAAAANmqdAEAAAAAKwRNH0Z7CZ0UwYTTv4yGrXw5GrU%3D44TSar7j7aQ4zqWsDuuhQ1PDttYHTmPruAYKgcqcvDYOtgDCn0`,
  },
});

export const Auth = async () => {
  const { _requestMaker } = await client.appLogin();

  twApi.defaults.headers.common.Authorization = `Bearer AAAAAAAAAAAAAAAAAAAAANmqdAEAAAAAKwRNH0Z7CZ0UwYTTv4yGrXw5GrU%3D44TSar7j7aQ4zqWsDuuhQ1PDttYHTmPruAYKgcqcvDYOtgDCn0`;
  return;
};
Auth();

export default twApi;
