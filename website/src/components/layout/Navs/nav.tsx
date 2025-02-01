"use client";

import { Button } from "@/components/ui/button";
import { useDispatch } from "react-redux";
import { toggleMenu } from "@/redux-store/slices/menuSlice";

export function Nav() {
  const dispatch = useDispatch();

  const handleToggle = () => dispatch(toggleMenu());

  return (
    <div>
      <nav className="w-full z-50 bg-transparent">
        <div className="flex justify-between items-center">
          <div></div>

          {/* Menu Button */}
          <Button
            variant="ghost"
            size="icon"
            className="relative w-10 h-10 flex flex-col items-center justify-center gap-1.5 hover:bg-transparent"
            aria-label="Toggle Menu"
            onClick={handleToggle}
          >
            <span className="w-6 h-[2px] bg-black" />
            <span className="w-6 h-[2px] bg-black" />
            <span className="w-6 h-[2px] bg-black" />
          </Button>
        </div>
      </nav>
    </div>
  );
}
