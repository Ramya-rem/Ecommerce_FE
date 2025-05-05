const HeroSection = () => {
    return (
      <div className="relative bg-[#f8f0e5] py-12 px-6 rounded-lg mx-auto max-w-5xl my-6">
        <div className="flex flex-col md:flex-row items-center">
          <div className="md:w-1/2 flex justify-center mb-8 md:mb-0">
            <img src="/images/cheesecake.png" alt="Cheese Cake" className="rounded-lg w-full max-w-md" />
          </div>
          <div className="md:w-1/2 text-center md:text-left">
            <h1 className="text-4xl md:text-5xl font-bold text-[#3a2618] mb-6">Delight in Every Bite!</h1>
            <button className="bg-primary hover:bg-primary-hover text-white font-medium py-3 px-8 rounded-full text-lg transition-colors">
              Shop Now
            </button>
          </div>
        </div>
      </div>
    )
  }
  
  export default HeroSection
  