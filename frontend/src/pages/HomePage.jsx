import { useEffect, useMemo, useState } from 'react'
import Hero from '../components/Hero.jsx'
import SearchBar from '../components/SearchBar.jsx'
import ProductCard from '../components/ProductCard.jsx'
import SectionTitle from '../components/SectionTitle.jsx'
import { fetchProducts } from '../api/products.js'

const HomePage = () => {
  const [loading, setLoading] = useState(true)
  const [products, setProducts] = useState([])
  const [query, setQuery] = useState('')

  useEffect(() => {
    const load = async () => {
      setLoading(true)
      try {
        const data = await fetchProducts()
        setProducts(data)
      } catch (error) {
        console.error(error)
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [])

  const filtered = useMemo(() => {
    if (!query) return products
    return products.filter((product) =>
      product.name.toLowerCase().includes(query.toLowerCase()) ||
      product.metadata?.tags?.some((tag) => tag.toLowerCase().includes(query.toLowerCase()))
    )
  }, [products, query])

  return (
    <div className='py-10 space-y-10'>
      <Hero />
      <div className='flex flex-col md:flex-row items-center gap-4'>
        <SearchBar value={query} onChange={setQuery} />
        <div className='flex items-center gap-3 text-sm text-white/60'>
          <span className='material-icons text-secondary'>verified</span>
          Produtos oficiais e suporte 24/7
        </div>
      </div>

      <section id='destaques'>
        <SectionTitle title='Destaques' description='Ofertas selecionadas com entrega automatizada.' />
        {loading ? (
          <p className='text-white/60 text-sm'>Carregando catálogo...</p>
        ) : (
          <div className='grid gap-5 md:grid-cols-2 xl:grid-cols-3'>
            {filtered.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}
      </section>

      <section id='categorias' className='bg-white/5 border border-white/5 rounded-3xl p-8'>
        <SectionTitle
          title='Categorias populares'
          description='Descubra serviços digitais e jogos para todas as plataformas.'
        />
        <div className='grid md:grid-cols-3 gap-6 text-sm text-white/70'>
          <CategoryCard
            title='Gift Cards'
            description='Steam, PlayStation, Xbox, Google Play e muito mais com entrega por e-mail em segundos.'
          />
          <CategoryCard
            title='Jogos em Pré-venda'
            description='Garanta lançamentos com preços especiais e ativações globais garantidas.'
          />
          <CategoryCard
            title='Serviços e assinaturas'
            description='Game Pass, HBO Max, Spotify Premium e plataformas de streaming autenticadas.'
          />
        </div>
      </section>
    </div>
  )
}

const CategoryCard = ({ title, description }) => (
  <div className='p-6 rounded-2xl bg-card/80 border border-white/10 hover:border-primary/60 transition'>
    <h3 className='text-lg font-semibold text-white mb-2'>{title}</h3>
    <p className='text-white/60 text-sm leading-relaxed'>{description}</p>
  </div>
)

export default HomePage
