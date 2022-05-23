import axios from "axios";

export const useFetcher = (url: string, obj?: any) => {
  const post = async (): Promise<any> => {
    const response = await axios.post(url, obj);
    return response;
  };

  const get = async (): Promise<any> => {
    const res = await axios.get(url);
    return res.data.response;
  };

  return { post, get };
};
