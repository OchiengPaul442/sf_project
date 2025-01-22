"use client";

import dynamic from "next/dynamic";
import { useSelector, useDispatch } from "@/redux-store/hooks";
import { toggleMenu } from "@/redux-store/slices/menuSlice";

// Dynamic Imports
const HeaderSection = dynamic(() => import("@/views/Home/header-section"));
const HowSection = dynamic(() => import("@/views/Home/how-section"));
const WorkSection = dynamic(() => import("@/views/Home/work-section"));
const InvestSection = dynamic(() => import("@/views/Home/invest-section"));
const FooterSection = dynamic(() => import("@/views/Home/footer-section"));
const RobotSection = dynamic(() => import("./robotSection"));
const MenuModal = dynamic(() => import("@/components/dialog/menu-modal"));

// Disable SSR for components that rely on browser APIs
const HowSectionCarousel = dynamic(
  () => import("@/components/carousels/how-section-carousel"),
  { ssr: false } // Disable SSR
);

export default function HomePage() {
  const dispatch = useDispatch();
  const isOpen = useSelector((state) => state.menu.isOpen);

  // Toggle menu
  const handleToggle = () => {
    dispatch(toggleMenu());
  };

  return (
    <div>
      <HeaderSection />
      <main className="overflow-y-auto snap-y snap-mandatory">
        <RobotSection />
        <HowSection />
      </main>
      {/* Ensure this runs only on the client */}
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
