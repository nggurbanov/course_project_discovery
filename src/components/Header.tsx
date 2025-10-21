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
    if (isMobile) {
      const mobileLinkClass = (isActive: boolean) => cn(
        "flex items-center w-full p-3 rounded-lg text-base font-medium transition-colors",
        isActive ? "bg-blue-50 text-blue-700" : "text-gray-700 hover:bg-gray-50"
      );

      return (
        <>
          <Link to="/projects" className={mobileLinkClass(isProjects)} onClick={() => setIsMenuOpen(false)}>
            Проекты
          </Link>
          <Link to="/favorites" className={mobileLinkClass(isFavorites)} onClick={() => setIsMenuOpen(false)}>
            <Heart className={`w-5 h-5 mr-3 ${isFavorites ? 'fill-current text-pink-600' : ''}`} />
            <span>Избранное</span>
            {favoritesCount > 0 && (
              <Badge className={cn("ml-auto text-xs", isFavorites ? 'bg-blue-100 text-blue-700' : 'bg-pink-100 text-pink-700')}>
                {favoritesCount}
              </Badge>
            )}
          </Link>
          <Link to="/about" className={mobileLinkClass(isAbout)} onClick={() => setIsMenuOpen(false)}>
            О проекте
          </Link>
          <Link to="/guide" className={mobileLinkClass(isGuide)} onClick={() => setIsMenuOpen(false)}>
            Руководство
          </Link>
        </>
      );
    }

    // Desktop links remain unchanged
    return (
      <>
        <Button
          asChild
          variant="ghost"
          size="sm"
          className={isProjects ? "bg-gradient-to-r from-blue-600 to-purple-600 text-white hover:from-blue-700 hover:to-purple-700 border-b-2 border-blue-700" : "hover:bg-gray-100"}
        >
          <Link to="/projects">
            Проекты
          </Link>
        </Button>
        <Button
          asChild
          variant="ghost"
          size="sm"
          className={isFavorites ? "bg-gradient-to-r from-pink-600 to-red-600 text-white hover:from-pink-700 hover:to-red-700 border-b-2 border-pink-700" : "hover:bg-gray-100"}
        >
          <Link to="/favorites" className="flex items-center space-x-1.5">
            <Heart className={`w-4 h-4 ${isFavorites ? 'fill-current' : ''}`} />
            <span>Избранное</span>
            {favoritesCount > 0 && (
              <Badge className={`ml-1 ${isFavorites ? 'bg-white/20 text-white hover:bg-white/30' : 'bg-pink-100 text-pink-700 hover:bg-pink-200'} text-xs px-1.5 py-0 min-w-[20px] h-5`}>
                {favoritesCount}
              </Badge>
            )}
          </Link>
        </Button>
        <Button
          asChild
          variant="ghost"
          size="sm"
          className={isAbout ? "bg-gradient-to-r from-blue-600 to-purple-600 text-white hover:from-blue-700 hover:to-purple-700 border-b-2 border-blue-700" : "hover:bg-gray-100"}
        >
          <Link to="/about">
            О проекте
          </Link>
        </Button>
        <Button
          asChild
          variant="ghost"
          size="sm"
          className={isGuide ? "bg-gradient-to-r from-blue-600 to-purple-600 text-white hover:from-blue-700 hover:to-purple-700 border-b-2 border-blue-700" : "hover:bg-gray-100"}
        >
          <Link to="/guide">
            Руководство
          </Link>
        </Button>
      </>
    );
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-white/95 md:backdrop-blur supports-[backdrop-filter]:bg-white/60">
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
            <Drawer 
              open={isMenuOpen} 
              onOpenChange={setIsMenuOpen}
              dismissible={true}
              shouldScaleBackground={false}
            >
              <DrawerTrigger asChild>
                <Button variant="ghost" size="icon">
                  <Menu className="w-6 h-6" />
                </Button>
              </DrawerTrigger>
              <DrawerContent side="right" className="bg-white">
                <div className="flex items-center justify-between p-4 border-b sticky top-0 bg-white z-10">
                   <h2 className="text-lg font-semibold">Навигация</h2>
                  <DrawerClose asChild>
                     <Button variant="ghost" size="icon">
                      <X className="w-6 h-6" />
                    </Button>
                  </DrawerClose>
                </div>
                <nav className="flex flex-col space-y-2 p-4 overflow-y-auto">
                  {renderNavLinks(true)}
                </nav>
              </DrawerContent>
            </Drawer>
          </div>
        </div>
      </div>
    </header>
  );
};

