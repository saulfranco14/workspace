import styled from 'styled-components';
import Link from 'next/link';

export const HeaderStyle = {
  HeaderContainer: styled.header`
    background-color: #ffffff;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
    position: sticky;
    top: 0;
    z-index: 100;

    .container {
      max-width: 1200px;
      margin: 0 auto;
      padding: 0 20px;
    }
  `,

  HeaderContent: styled.div`
    display: flex;
    align-items: center;
    justify-content: space-between;
    height: 70px;
  `,

  Logo: styled.div`
    font-size: 1.5rem;
    font-weight: bold;
    color: var(--primary);

    @media (max-width: 425px) {
      display: none;
    }
  `,

  LogoLink: styled(Link)`
    text-decoration: none;
    display: flex;
    align-items: center;
    gap: 10px;
  `,

  NavLinks: styled.nav`
    display: flex;
    gap: 20px;

    @media (max-width: 768px) {
      position: fixed;
      top: 70px;
      left: 0;
      right: 0;
      background-color: white;
      flex-direction: column;
      padding: 20px;
      box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
      transform: translateY(-100%);
      opacity: 0;
      pointer-events: none;
      transition: all 0.3s ease;

      &.open {
        transform: translateY(0);
        opacity: 1;
        pointer-events: all;
      }
    }
  `,

  NavLink: styled(Link)`
    color: #333;
    text-decoration: none;
    font-weight: 500;
    padding: 5px 0;
    transition: color 0.2s;

    &:hover {
      color: var(--primary);
    }
  `,

  ActionButtons: styled.div`
    display: flex;
    align-items: center;
    gap: 15px;
  `,

  ActionButton: styled.button`
    background: none;
    border: none;
    font-size: 1.3rem;
    color: #333;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    width: 40px;
    height: 40px;
    border-radius: 50%;
    transition: background-color 0.2s;

    &:hover {
      background-color: var(--primary-dark);
    }
  `,

  UserActions: styled.div`
    display: flex;
    gap: 10px;
  `,

  LoginButton: styled.button`
    background-color: var(--primary);
    color: white;
    border: none;
    border-radius: 4px;
    padding: 8px 16px;
    font-weight: 500;
    cursor: pointer;
    transition: background-color 0.2s;

    &:hover {
      background-color: var(--primary-dark);
    }
  `,

  MenuButton: styled.button`
    display: none;
    background: none;
    border: none;
    font-size: 1.5rem;
    cursor: pointer;
    color: #333;

    @media (max-width: 768px) {
      display: block;
    }
  `,
};
