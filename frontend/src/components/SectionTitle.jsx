const SectionTitle = ({ title, description, action }) => (
  <div className='flex flex-col md:flex-row md:items-center md:justify-between gap-3 mb-6'>
    <div>
      <h2 className='text-2xl font-semibold text-white'>{title}</h2>
      {description && <p className='text-sm text-white/60 mt-1'>{description}</p>}
    </div>
    {action}
  </div>
)

export default SectionTitle
