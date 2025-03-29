import styled from 'styled-components';

export const InputLabel = styled.label`
  display: block;
  font-size: 0.9rem;
  margin-bottom: 0.5rem;
  color: #666;
`;

export const TextInput = styled.input`
  width: 100%;
  padding: 0.75rem;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 1rem;
  &:focus {
    outline: none;
    border-color: #1E8E3E;
  }
`;

export const InputGroup = styled.div`
  margin-bottom: 1.5rem;
`;

export const ErrorMessage = styled.p`
  color: #d32f2f;
  font-size: 0.8rem;
  margin-top: 0.25rem;
`;