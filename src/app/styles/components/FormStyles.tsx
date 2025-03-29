import styled from 'styled-components';

export const FormContainer = styled.div`
  width: 100%;
  max-width: 500px;
  margin: 0 auto;
`;

export const FormTitle = styled.h2`
  color: #1E8E3E;
  font-size: 2rem;
  text-align: center;
  margin-bottom: 2rem;
`;


export const FormLink = styled.div`
  text-align: center;
  margin-top: 1.5rem;
  font-size: 0.9rem;
  a {
    color: #1E8E3E;
    text-decoration: none;
    &:hover {
      text-decoration: underline;
    }
  }
`;

