"use client";

import {
  useDispatch as useAppDispatch,
  useSelector as useAppSelector,
} from "react-redux";
import type { RootState, AppDispatch } from "./index";

export const useDispatch = useAppDispatch<AppDispatch>;
export const useSelector = useAppSelector<RootState>;
