const MapComponent = ({ address }) => {
  const encoded = encodeURIComponent(address || "Lagos, Nigeria")

  return (
    <div className="relative w-full h-64 sm:h-80 bg-gray-300 rounded-xl overflow-hidden border">
      <iframe
        title="Google Map"
        className="w-full h-full"
        src={`https://www.google.com/maps?q=${encoded}&output=embed`}
        allowFullScreen
        loading="lazy"
        referrerPolicy="no-referrer-when-downgrade"
      />
    </div>
  )
}

export default MapComponent
