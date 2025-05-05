const Marquee = () => {
  return (
    <div className="bg-[#fff9e9] py-6 my-8">
      <div className="overflow-hidden whitespace-nowrap">
        <div className="inline-block animate-marquee">
          <span className="text-xl font-medium mx-4">Special Offers: 20% off on first order!</span>
          <span className="text-xl font-medium mx-4">Free delivery on orders above $50</span>
        </div>
      </div>
    </div>
  )
}

export default Marquee
