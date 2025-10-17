const SearchBar = ({ value, onChange }) => (
  <div className='relative flex-1'>
    <span className='material-icons absolute left-4 top-1/2 -translate-y-1/2 text-white/40'>search</span>
    <input
      value={value}
      onChange={(event) => onChange(event.target.value)}
      placeholder='Busque por jogos, serviços, gift cards...'
      className='w-full pl-12 pr-4 py-3 rounded-2xl bg-white/5 border border-white/10 focus:outline-none focus:border-primary/60 text-sm backdrop-blur'
    />
  </div>
)

export default SearchBar
