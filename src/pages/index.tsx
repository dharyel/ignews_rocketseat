import Head from 'next/head';
import { SubscribeButton } from '../components/SubscribeButton';
import { stripe } from '../services/stripe';
//import { GetServerSideProps } from 'next';
import { GetStaticProps } from 'next';

import styles from './home.module.scss';

interface HomeProps {
  product: {
    priceId: string;
    amount: string;
  }
}

export default function Home({ product }: HomeProps) {
  return (
    <>
      <Head>
        <title>Home | ig.news</title>
      </Head>

      <main className={styles.contentContainer}>
        <section className={styles.hero}>
          <span>Hey, welcome!</span>
          <h1>News about the <span>React</span> world.</h1>
          <p>
            Get access to all the publications <br />
            <span>for {product.amount} / month</span>
          </p>

          <SubscribeButton />
        </section>

        <img src="/images/avatar.svg" alt="girl coding" />
      </main>
    </>
  )
}
/*
getStaticProps é para buscar as informações do servidor de forma estática, retornando já um html pronto com todos os dados necessários
*/
export const getStaticProps: GetStaticProps = async () => {
  const price = await stripe.prices.retrieve('price_1Jma1PElrPnmwpOQeDnH5dzR', {
    expand:['product']
  })


  const product = {
    priceId: price.id,
    amount: new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(price.unit_amount / 100),
    //os valores que vem do stripe são em centavos, então é necessário dividir pro 100 para ter o valor real
  }

  return {
    props: {
      product,
    },
    /*a propriedade revalidate é o tempo em segundos em que o html se manterá estático.
    Após acabar o tempo, será gerado um novo html estático
    */
    revalidate: 60 * 60 * 24,//24 hours
  }
}

/*
getServerSideProps é para sempre buscar as informações do servidor, mesmo que não mudem por bastante tempo

export const getServerSideProps: GetServerSideProps = async () => {
  const price = await stripe.prices.retrieve('price_1Jma1PElrPnmwpOQeDnH5dzR', {
    expand:['product']
  })

  const product = {
    priceId: price.id,
    amount: new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(price.unit_amount / 100),
    //os valores que vem do stripe são em centavos, então é necessário dividir pro 100 para ter o valor real
  }

  return {
    props: {
      product,
    }
  }
}
*/