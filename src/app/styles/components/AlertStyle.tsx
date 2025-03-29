import styled from 'styled-components';

export const AlertMessage = styled.div<{ type: 'error' | 'success' }>`
  background-color: ${props => props.type === 'error' ? '#ffebee' : '#e8f5e9'};
  color: ${props => props.type === 'error' ? '#c62828' : '#2e7d32'};
  padding: 1rem;
  border-radius: 4px;
  margin-bottom: 1.5rem;
`; 