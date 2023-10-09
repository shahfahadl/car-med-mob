import { useState } from "react";

const DrawerHook = () => {
  const [isOpen, setIsOpen] = useState(false);

  const openDrawer = () => {
    setIsOpen(true);
  };

  const closeDrawer = () => {
    setIsOpen(false);
  };

  return {
    isOpen,
    openDrawer,
    closeDrawer,
  };
};

export default DrawerHook;
