import {
  postContactUs,
  postInvestment,
  postEngineers,
  postRestaurants,
} from "@/app/server/api";
import useSWRMutation from "swr/mutation";

export function useContactUsSubmission() {
  return useSWRMutation("/contactUsSubmission", postContactUs);
}

export function useInvestmentSubmission() {
  return useSWRMutation("/investorSubmission", postInvestment);
}

export function useEngineersSubmission() {
  return useSWRMutation("/engineerSubmission", postEngineers);
}

export function useRestaurantsSubmission() {
  return useSWRMutation("/restaurantOwnerSubmission", postRestaurants);
}
