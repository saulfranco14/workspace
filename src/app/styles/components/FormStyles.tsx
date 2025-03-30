import styled from 'styled-components';

export const FormContainer = styled.div`
  width: 100%;
  max-width: 400px;
  margin: 0 auto;
`;

export const FormTitle = styled.h2`
  color: #007537;
  font-size: 1.5rem;
  font-weight: 600;
  margin-bottom: 1.5rem;
`;

export const FormLink = styled.div`
  text-align: center;
  margin-top: 1.5rem;
  font-size: 14px;
  color: #616161;
  a {
    text-decoration: none;
    font-weight: 500;
    &:hover {
      text-decoration: underline;
    }
  }
`;

export const FormFooter = styled.div`
  font-size: 0.8rem;
  color: #616161;
  text-align: left;
  margin-top: 1.5rem;
  font-size: 14px;
  
  a {
    color: #007537;
    text-decoration: none;
    &:hover {
      text-decoration: underline;
    }
  }
`;

