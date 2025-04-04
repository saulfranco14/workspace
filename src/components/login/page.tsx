'use client';

import LoginForm from './LoginForm';
import { ContentContainer, FormSection, ImageSection } from '@/styles';
import Image from 'next/image';
import MainContainer from '../shared/MainContainer';

export default function LoginPage() {
  return (
    <MainContainer>
      <ContentContainer>
        <FormSection>
          <LoginForm />
        </FormSection>
        <ImageSection>
          <Image
            src="/login/plant_1.jpg"
            alt="Planta decorativa"
            priority
            fill
            className="object-cover lg:rounded-3xl"
          />
        </ImageSection>
      </ContentContainer>
    </MainContainer>
  );
}
