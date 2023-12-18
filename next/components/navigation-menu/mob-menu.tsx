import { Menu } from '@/lib/zod/menu';
import React from 'react'
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
  SheetClose
} from "@/ui/sheet";

import Hamburger from "@/styles/icons/menu.svg";
import { LanguageSwitcher } from '../header/language-switcher';
import { DarkModeToggle } from '../dark-mode-toggle';
import Link from 'next/link';

interface NavigationMenuProps {
  menu: Menu;
}

const MobMenu = ({ menu }: NavigationMenuProps) => {
  const [open, setOpen] = React.useState(false)
  return (
    <Sheet open={open} onOpenChange={setOpen} >
      <SheetTrigger>
        <Hamburger className="desktopMenu:hidden w-6 h-6" />
      </SheetTrigger>
      <SheetContent side="bottom">
        <SheetHeader>
          <SheetTitle>Menu</SheetTitle>
          <SheetDescription>
            <ul className="flex w-full flex-col items-center">
              {menu.map((item) =>
                <Link
                  className="block text-main select-none rounded-md py-2 no-underline outline-none transition-colors hover:after:absolute hover:after:bottom-[-1px] hover:after:content=[''] hover:after:h-[2px] hover:after:bg-main hover:after:animate-underline"
                  href={item.url}
                >
                  <li onClick={() => setOpen(false)}>
                    {item.title}
                  </li>
                </Link>
              )}
            </ul>
          </SheetDescription>
        </SheetHeader>
        <SheetTitle>Preferences</SheetTitle>
        <SheetDescription>
          Here you can change your preferences related to the language and
          theme
        </SheetDescription>
        <SheetTitle>Theme switcher</SheetTitle>
        <DarkModeToggle />
        <SheetTitle>Language switcher</SheetTitle>
        <LanguageSwitcher />
      </SheetContent>
    </Sheet >

  )
}

export default MobMenu
