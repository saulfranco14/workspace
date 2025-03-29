import styled from 'styled-components';

export const NavSection = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1.5rem;
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  z-index: 10;
  background-color: transparent;
`;

export const Logo = styled.div`
  width: 40px;
  height: 40px;
`;

export const Nav = styled.nav`
  display: flex;
  gap: 2rem;
  
  @media (max-width: 768px) {
    display: none;
  }
`;

export const NavLink = styled.a`
  text-decoration: none;
  color: #333;
  font-size: 1rem;
  font-weight: 500;
  
  &:hover {
    color: #007537;
  }
`;

export const CartIcon = styled.div`
  width: 24px;
  height: 24px;
  cursor: pointer;
`; 