import styled from 'styled-components';

export const NavSection = styled.div`
  display: flex;
  justify-content: space-between;
  padding: 1rem;
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  z-index: 10;
`;

export const Logo = styled.div`
  width: 40px;
  height: 40px;
`;

export const Nav = styled.nav`
  display: flex;
  gap: 1.5rem;
`;

export const NavLink = styled.a`
  text-decoration: none;
  color: #333;
  font-size: 0.9rem;
  
  &:hover {
    color: #1E8E3E;
  }
`;

export const CartIcon = styled.div`
  width: 24px;
  height: 24px;
  cursor: pointer;
`; 