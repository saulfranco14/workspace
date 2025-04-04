'use client';

import RegisterForm from './RegisterForm';
import { ContentContainer, FormSection, ImageSection } from '@/styles';
import Image from 'next/image';
import MainContainer from '../shared/MainContainer';

export default function RegisterPage() {
  return (
    <MainContainer>
      <ContentContainer>
        <FormSection>
          <RegisterForm />
        </FormSection>
        <ImageSection>
          <Image
            src="/register/plant_2.jpg"
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
