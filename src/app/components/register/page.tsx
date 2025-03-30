'use client';

import RegisterForm from './RegisterForm';
import Navbar from '../navigation/Navbar';
import { ContentContainer, FormSection, ImageSection } from '@/app/styles';
import Image from 'next/image';
import MainContainer from '../shared/MainContainer';

export default function RegisterPage() {
  return (
    <MainContainer>
      <Navbar />
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
