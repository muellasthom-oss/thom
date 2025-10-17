const statusMap = {
  pending: 'bg-yellow-500/20 text-yellow-400 border-yellow-500/40',
  processing: 'bg-blue-500/20 text-blue-300 border-blue-500/40',
  completed: 'bg-green-500/20 text-green-300 border-green-500/40',
  failed: 'bg-red-500/20 text-red-300 border-red-500/40',
  cancelled: 'bg-white/10 text-white/60 border-white/20'
}

const StatusBadge = ({ status }) => (
  <span className={`px-3 py-1 rounded-full text-xs border ${statusMap[status] || 'bg-white/10 text-white/60 border-white/20'}`}>
    {status}
  </span>
)

export default StatusBadge
