'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useState, useEffect } from 'react';
import { NavSection, Logo, Nav, NavLink, CartIcon } from '@/app/styles';

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as HTMLElement;
      if (isMenuOpen && !target.closest('nav') && !target.closest('button')) {
        setIsMenuOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isMenuOpen]);

  return (
    <header>
      <NavSection>
        <Logo>
          <Link href="/">
            <Image src="/logo.svg" alt="Logo" width={40} height={40} priority />
          </Link>
        </Logo>

        <div className="hidden md:block">
          <Nav>
            <NavLink href="/plantas">Plantas</NavLink>
            <NavLink href="/accesorios">Accesorios</NavLink>
            <NavLink href="/favoritos">Favoritos</NavLink>
            <NavLink href="/ofertas">Ofertas</NavLink>
          </Nav>
        </div>

        <div className="flex items-center gap-4">
          <div className="cursor-pointer">
            <Link href="/login">
              <Image src="/icon_profile.svg" alt="Perfil" width={28} height={28} priority />
            </Link>
          </div>

          <CartIcon>
            <Link href="/carrito">
              <Image src="/cart-icon.svg" alt="Carrito" width={24} height={24} priority />
            </Link>
          </CartIcon>

          <button
            className="md:hidden flex items-center p-1 z-30"
            onClick={toggleMenu}
            aria-expanded={isMenuOpen}
            aria-label="Toggle navigation"
          >
            {isMenuOpen ? (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                className="w-6 h-6"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            ) : (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                className="w-6 h-6"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            )}
          </button>
        </div>

        {isMenuOpen && (
          <div className="fixed top-[70px] left-0 right-0 bg-white shadow-lg py-4 px-6 md:hidden z-20 h-auto">
            <nav className="flex flex-col space-y-3">
              <NavLink href="/plantas" onClick={toggleMenu}>
                Plantas
              </NavLink>
              <NavLink href="/accesorios" onClick={toggleMenu}>
                Accesorios
              </NavLink>
              <NavLink href="/favoritos" onClick={toggleMenu}>
                Favoritos
              </NavLink>
              <NavLink href="/ofertas" onClick={toggleMenu}>
                Ofertas
              </NavLink>
              <NavLink href="/login" onClick={toggleMenu}>
                Iniciar Sesión
              </NavLink>
            </nav>
          </div>
        )}
      </NavSection>
    </header>
  );
}
