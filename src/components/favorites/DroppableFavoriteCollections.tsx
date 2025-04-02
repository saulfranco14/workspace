'use client';

import { FC } from 'react';
import styled from 'styled-components';

import FavoriteCollections from '@/components/favorites/FavoriteCollections';

const DroppableContainer = styled.div`
  h3 {
    font-size: 1.125rem;
    font-weight: 600;
    color: #1f2937;
    margin: 0 0 1rem 0;
  }
`;

const CollectionsContainer = styled.div`
  background-color: white;
  border-radius: 0.5rem;
  overflow: hidden;
`;

const DroppableFavoriteCollections: FC = () => {
  return (
    <DroppableContainer>
      <h3>Arrastra productos a tus colecciones</h3>
      <CollectionsContainer>
        <FavoriteCollections />
      </CollectionsContainer>
    </DroppableContainer>
  );
};

export default DroppableFavoriteCollections;
