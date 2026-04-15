export default function StatusPill({ status }) {
  const labels = {
    pending: 'Bekliyor',
    preparing: 'Hazırlanıyor',
    ready: 'Hazır',
    paid: 'Ödendi',
    cancelled: 'İptal',
  }

  return <span className={`pill ${status}`}>{labels[status] || status}</span>
}
