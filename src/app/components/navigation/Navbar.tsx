'use client';

import Image from 'next/image';
import Link from 'next/link';
import {
  NavSection,
  Logo,
  Nav,
  NavLink,
  CartIcon
} from '@/app/styles';

export default function Navbar() {
  return (
    <NavSection>
      <Logo>
        <Link href="/">
          <Image 
            src="/logo.svg" 
            alt="Logo" 
            width={40} 
            height={40} 
          />
        </Link>
      </Logo>
      <Nav> 
        <NavLink href="/plantas">Plantas</NavLink>
        <NavLink href="/accesorios">Accesorios</NavLink>
        <NavLink href="/favoritos">Favoritos</NavLink>
        <NavLink href="/ofertas">Ofertas</NavLink>
      </Nav>
      <CartIcon>
        <Image 
          src="/cart-icon.svg" 
          alt="Carrito" 
          width={24} 
          height={24} 
        />
      </CartIcon>
    </NavSection>
  );
} 