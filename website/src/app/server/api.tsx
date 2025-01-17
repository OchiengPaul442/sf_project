import axios from "axios";

export const postInvestment = (url: string, { arg }: { arg: any }) =>
  axios.post(url, arg).then((res) => res.data);
