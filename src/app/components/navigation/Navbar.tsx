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
        <NavLink href="/about">About</NavLink>
        <NavLink href="/features">Features</NavLink>
        <NavLink href="/pricing">Pricing</NavLink>
        <NavLink href="/plantas">Plantas</NavLink>
        <NavLink href="/favoritos">Favoritos</NavLink>
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