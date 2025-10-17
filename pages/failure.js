import Head from 'next/head';

export default function Failure() {
  return (
    <>
      <Head>
        <title>Pagamento não autorizado | THOM Store</title>
      </Head>
      <main className="admin-wrapper" style={{ textAlign: 'center', maxWidth: '620px' }}>
        <div className="admin-card">
          <h1>Pagamento recusado</h1>
          <p style={{ color: 'rgba(226,232,240,0.75)' }}>
            Ocorreu um problema ao processar o pagamento. Tente novamente ou escolha outra forma de pagamento no Mercado
            Pago.
          </p>
          <a href="/" style={{ marginTop: '1.5rem', display: 'inline-block' }}>
            <button>Tentar novamente</button>
          </a>
        </div>
      </main>
    </>
  );
}
