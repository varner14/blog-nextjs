import Head from 'next/head';
import { GetServerSideProps } from 'next';

import { SubscribeButton } from '../components/SubscribeButton';

import { stripe } from '../services/stripe';
import styles from './home.module.scss';

interface HomeProps {
  product: {
    priceId: string;
    amount: number;
  };
}

export default function Home({ product }: HomeProps) {
  return (
    <h1>
      <Head>
        <title>Home | React.news</title>
      </Head>
      <main className={styles.contentContainer}>
        <section className={styles.hero}>
          <span> 👏 Hey, welcome</span>
          <h1>
            {' '}
            News about the <span>React</span> world.
          </h1>
          <p>
            Get access to all the publications <br />
            <span> for {product.amount} month</span>
          </p>
          <SubscribeButton priceId={product.priceId} />
        </section>

        <img src="/images/avatar.svg" alt="girl coding" />
      </main>
    </h1>
  );
}

export const getServerSideProps: GetServerSideProps = async () => {
  const price = await stripe.prices.retrieve('price_1KuxogFx5wDE4sEQYEYvS06W', {
    expand: ['product'],
  });

  const product = {
    priceID: price.id,
    amount: new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(price.unit_amount / 100),
  };

  return {
    props: {
      product,
      revalidate: 60 * 60 * 24, // 24hours
    },
  };
};
