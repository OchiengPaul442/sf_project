"use client";

import HeaderSection from "@/views/Home/header-section";
import HowSection from "@/views/Home/how-section";
import WorkSection from "@/views/Home/work-section";
import InvestSection from "@/views/Home/invest-section";
import FooterSection from "@/views/Home/footer-section";
import { HowSectionCarousel } from "@/components/carousels/how-section-carousel";
import MenuModal from "@/components/dialog/menu-modal";

import { useSelector, useDispatch } from "@/redux-store/hooks";

import { toggleMenu } from "@/redux-store/slices/menuSlice";
import RobotSection from "./robotSection";

export default function HomePage() {
  const dispatch = useDispatch();
  const isOpen = useSelector((state) => state.menu.isOpen);

  // toggle menu
  const handleToggle = () => {
    dispatch(toggleMenu());
  };

  return (
    <div>
      <HeaderSection />
      <RobotSection />
      <HowSection />
      <HowSectionCarousel />
      <main className="overflow-y-auto snap-y snap-mandatory">
        <WorkSection />
        <InvestSection />
        <FooterSection />
      </main>

      {/* Menu Modal */}
      <MenuModal isOpen={isOpen as boolean} onClose={handleToggle} />
    </div>
  );
}
