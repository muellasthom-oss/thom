import Head from 'next/head';

export default function Success() {
  return (
    <>
      <Head>
        <title>Pagamento aprovado | THOM Store</title>
      </Head>
      <main className="admin-wrapper" style={{ textAlign: 'center', maxWidth: '620px' }}>
        <div className="admin-card">
          <h1>Pagamento confirmado 🎉</h1>
          <p style={{ color: 'rgba(226,232,240,0.75)' }}>
            Obrigado por comprar com a THOM Store. Você receberá o link de download em seu e-mail cadastrado no Mercado
            Pago.
          </p>
          <a href="/" style={{ marginTop: '1.5rem', display: 'inline-block' }}>
            <button>Voltar para a loja</button>
          </a>
        </div>
      </main>
    </>
  );
}
