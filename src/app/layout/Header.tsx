'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useState } from 'react';
import { FiUser, FiLogOut, FiMenu } from 'react-icons/fi';

import { useSession } from '@/hooks/useSession';
import CartButton from '@/components/cart/CartButton';
import { HeaderStyle } from '@/styles/components/HeaderStyle';
import { useClientReady } from '@/hooks/useClientReady';

const Header = () => {
  const clientReady = useClientReady();

  const [menuOpen, setMenuOpen] = useState(false);
  const { user } = useSession();

  if (!clientReady) return null;

  return (
    <HeaderStyle.HeaderContainer>
      <div className="container">
        <HeaderStyle.HeaderContent>
          <HeaderStyle.LogoLink href="/">
            <Image src="/logo.svg" alt="Logo" width={40} height={40} priority />
            <HeaderStyle.Logo>PlantShop</HeaderStyle.Logo>
          </HeaderStyle.LogoLink>

          <HeaderStyle.NavLinks className={menuOpen ? 'open' : ''}>
            <HeaderStyle.NavLink href="/productos">Productos</HeaderStyle.NavLink>
            <HeaderStyle.NavLink href="/favoritos">Favoritos</HeaderStyle.NavLink>
          </HeaderStyle.NavLinks>

          <HeaderStyle.ActionButtons>
            <CartButton />

            {user ? (
              <HeaderStyle.UserActions>
                <Link href="/perfil">
                  <HeaderStyle.ActionButton>
                    <FiUser />
                  </HeaderStyle.ActionButton>
                </Link>
                <HeaderStyle.ActionButton>
                  <FiLogOut />
                </HeaderStyle.ActionButton>
              </HeaderStyle.UserActions>
            ) : (
              <Link href="/login">
                <HeaderStyle.LoginButton>Iniciar sesión</HeaderStyle.LoginButton>
              </Link>
            )}

            <HeaderStyle.MenuButton onClick={() => setMenuOpen(!menuOpen)}>
              <FiMenu />
            </HeaderStyle.MenuButton>
          </HeaderStyle.ActionButtons>
        </HeaderStyle.HeaderContent>
      </div>
    </HeaderStyle.HeaderContainer>
  );
};

export default Header;
