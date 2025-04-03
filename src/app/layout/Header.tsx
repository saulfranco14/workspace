'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useState } from 'react';
import { FiUser, FiLogOut, FiMenu } from 'react-icons/fi';
import { useDispatch } from 'react-redux';

import { useSession } from '@/hooks/useSession';
import { HeaderStyle } from '@/styles/components/HeaderStyle';
import { useClientReady } from '@/hooks/useClientReady';
import { logoutUserThunk } from '@/store/auth/thunk/authThunk';
import { AppDispatch } from '@/store/store';
import CartButton from '@/components/cart/CartButton';

const Header = () => {
  const clientReady = useClientReady();
  const dispatch = useDispatch<AppDispatch>();

  const [menuOpen, setMenuOpen] = useState(false);
  const { user } = useSession();

  const handleLogout = () => {
    dispatch(logoutUserThunk());
  };

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
                <HeaderStyle.ActionButton onClick={handleLogout}>
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
