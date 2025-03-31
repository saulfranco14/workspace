import styled from 'styled-components';
import Link from 'next/link';

export const NavSection = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem;
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 10;
  background-color: #ffffff;
  margin: 0;
  width: 100%;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);

  @media (max-width: 768px) {
    padding: 0.8rem 1rem;
  }
`;

export const Logo = styled.div`
  width: 40px;
  height: 40px;
  z-index: 20;
`;

export const Nav = styled.nav`
  display: flex;
  gap: 2rem;

  @media (max-width: 768px) {
    width: 100%;
    flex-direction: column;
    align-items: center;
    padding: 1rem 0;
  }
`;

export const NavLink = styled(Link)`
  text-decoration: none;
  color: #333;
  font-size: 1rem;
  font-weight: 500;
  transition: color 0.2s ease;

  &:hover {
    color: #007537;
  }

  @media (max-width: 768px) {
    padding: 0.5rem 0;
    width: 100%;
    text-align: left;
  }
`;

export const CartIcon = styled.div`
  width: 24px;
  height: 24px;
  cursor: pointer;
  transition: transform 0.2s ease;
  margin-right: 1rem;

  &:hover {
    transform: scale(1.1);
  }
`;
