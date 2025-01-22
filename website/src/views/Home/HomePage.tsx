"use client";

import dynamic from "next/dynamic";
import { useSelector, useDispatch } from "@/redux-store/hooks";
import { toggleMenu } from "@/redux-store/slices/menuSlice";

// Dynamic Imports
const HeaderSection = dynamic(() => import("@/views/Home/header-section"), {
  ssr: false,
}); // Disable SSR if HeaderSection accesses browser APIs
const HowSection = dynamic(() => import("@/views/Home/how-section"), {
  ssr: false,
});
const WorkSection = dynamic(() => import("@/views/Home/work-section"), {
  ssr: false,
});
const InvestSection = dynamic(() => import("@/views/Home/invest-section"), {
  ssr: false,
});
const FooterSection = dynamic(() => import("@/views/Home/footer-section"), {
  ssr: false,
});
const RobotSection = dynamic(() => import("./robotSection"), {
  ssr: false,
});
const MenuModal = dynamic(() => import("@/components/dialog/menu-modal"), {
  ssr: false,
});
const HowSectionCarousel = dynamic(
  () => import("@/components/carousels/how-section-carousel"),
  {
    ssr: false,
  }
); // Ensure this is client-side only

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
