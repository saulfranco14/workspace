import Link from 'next/link';
import { ButtonViewMore } from '@/app/styles/components/ButtonStyle';

type ViewMoreButtonProps = {
  productId: string;
};

const ViewMoreButton = ({ productId }: ViewMoreButtonProps) => {
  return (
    <Link className="w-full" href={`/productos/${productId}`} passHref>
      <ButtonViewMore>Ver más</ButtonViewMore>
    </Link>
  );
};

export default ViewMoreButton;
