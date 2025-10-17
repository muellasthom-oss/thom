import Head from 'next/head';

export default function Pending() {
  return (
    <>
      <Head>
        <title>Pagamento pendente | THOM Store</title>
      </Head>
      <main className="admin-wrapper" style={{ textAlign: 'center', maxWidth: '620px' }}>
        <div className="admin-card">
          <h1>Pagamento pendente</h1>
          <p style={{ color: 'rgba(226,232,240,0.75)' }}>
            Assim que o pagamento for aprovado, enviaremos o link de download automaticamente para o seu e-mail.
          </p>
          <a href="/" style={{ marginTop: '1.5rem', display: 'inline-block' }}>
            <button>Voltar para a loja</button>
          </a>
        </div>
      </main>
    </>
  );
}
