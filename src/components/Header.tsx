import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { GraduationCap, Heart, Menu, X } from 'lucide-react';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { useFavorites } from '../hooks/useFavorites';
import {
  Drawer,
  DrawerContent,
  DrawerTrigger,
  DrawerClose,
} from './ui/drawer';
import { cn } from '../lib/utils';

export const Header = () => {
  const location = useLocation();
  const { favoritesCount } = useFavorites();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const isProjects = location.pathname === '/projects';
  const isFavorites = location.pathname === '/favorites';
  const isAbout = location.pathname === '/about';
  const isGuide = location.pathname === '/guide';

  const renderNavLinks = (isMobile = false) => {
    const linkClass = (isActive: boolean) => cn(
      "w-full text-left justify-start p-4",
      !isMobile && "w-auto p-2",
      isActive ? "font-bold text-blue-600 bg-blue-50" : "hover:bg-gray-100"
    );

    return (
      <>
        <Button
          asChild
          variant="ghost"
          size="sm"
          className={linkClass(isProjects)}
        >
          <Link to="/projects">
            Проекты
          </Link>
        </Button>
        <Button
          asChild
          variant="ghost"
          size="sm"
          className={linkClass(isFavorites)}
        >
          <Link to="/favorites" className="flex items-center space-x-1.5">
            <Heart className={`w-4 h-4 ${isFavorites ? 'fill-current' : ''}`} />
            <span>Избранное</span>
            {favoritesCount > 0 && (
              <Badge className={cn(
                "ml-1 text-xs px-1.5 py-0 min-w-[20px] h-5",
                isFavorites ? 'bg-blue-100 text-blue-700' : 'bg-pink-100 text-pink-700'
              )}>
                {favoritesCount}
              </Badge>
            )}
          </Link>
        </Button>
        <Button
          asChild
          variant="ghost"
          size="sm"
          className={linkClass(isAbout)}
        >
          <Link to="/about">
            О проекте
          </Link>
        </Button>
        <Button
          asChild
          variant="ghost"
          size="sm"
          className={linkClass(isGuide)}
        >
          <Link to="/guide">
            Руководство
          </Link>
        </Button>
      </>
    )
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/60">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          {/* Logo & Title */}
          <Link to="/" className="flex items-center space-x-3 group">
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl blur-sm group-hover:blur-md transition-all" />
              <div className="relative w-10 h-10 rounded-xl bg-gradient-to-br from-blue-600 to-purple-600 flex items-center justify-center shadow-lg">
                <GraduationCap className="w-6 h-6 text-white" />
              </div>
            </div>
            <div className="flex flex-col">
              <h1 className="text-xl font-bold text-gray-900">
                Каталог проектов
              </h1>
              <p className="text-xs text-gray-500">Найдите идеальную тему для курсовой</p>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-2">
            {renderNavLinks()}
          </nav>

          {/* Mobile Navigation */}
          <div className="flex items-center md:hidden">
            <Drawer direction="right" open={isMenuOpen} onOpenChange={setIsMenuOpen}>
              <DrawerTrigger asChild>
                <Button variant="ghost" size="icon">
                  <Menu className="w-6 h-6" />
                </Button>
              </DrawerTrigger>
              <DrawerContent className="h-full w-3/4 max-w-sm">
                <div className="p-4">
                  <DrawerClose asChild className="mb-4">
                     <Button variant="ghost" size="icon" className="absolute top-4 right-4">
                      <X className="w-6 h-6" />
                    </Button>
                  </DrawerClose>
                  <nav className="flex flex-col space-y-2 mt-12">
                    {renderNavLinks(true)}
                  </nav>
                </div>
              </DrawerContent>
            </Drawer>
          </div>
        </div>
      </div>
    </header>
  );
};

