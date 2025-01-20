import { postInvestment } from "@/app/server/api";
import useSWRMutation from "swr/mutation";

export function useInvestSubmission() {
  return useSWRMutation("/invest", postInvestment);
}
