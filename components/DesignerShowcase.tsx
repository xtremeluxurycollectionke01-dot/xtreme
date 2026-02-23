import Image from "next/image"

const DesignerShowcase = () => {
  const designers = [
    {
      name: 'BALENCIAGA',
      image: '/images/image10.jpeg',
      items: 42
    },
    {
      name: 'GUCCI',
      image: '/images/image11.jpeg',
      items: 38
    },
    {
      name: 'OFF-WHITE',
      image: '/images/image12.jpeg',
      items: 56
    },
    {
      name: 'DIOR',
      image: '/images/image16.jpeg',
      items: 29
    },
    {
      name: 'PRADA',
      image: '/images/image14.jpeg',
      items: 34
    },
    {
      name: 'LOUIS VUITTON',
      image: '/images/image15.jpeg',
      items: 47
    }
  ]

  return (
    <section id="designers" className="py-20 bg-black">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-4xl md:text-5xl font-bold mb-4">
            FEATURED <span className="text-yellow-500">DESIGNERS</span>
          </h2>
          <p className="text-gray-400 text-lg max-w-2xl mx-auto">
            Collaborations with the world's most prestigious fashion houses
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {designers.map((designer, index) => (
            <div
              key={designer.name}
              className="group relative overflow-hidden rounded-2xl bg-gradient-to-br from-gray-900 to-black border border-gray-600 hover:border-yellow-500 transition-all duration-300"
            >
              <div className="relative aspect-[4/3] overflow-hidden">
                <Image
                    src={designer.image}
                    alt={designer.name}
                    fill
                    className="object-cover group-hover:scale-110 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent z-10"></div>
                </div>

              
              <div className="absolute bottom-0 left-0 right-0 p-6 z-20">
                <h3 className="text-gray-400 text-2xl font-bold mb-2">{designer.name}</h3>
                <p className="text-gray-400">{designer.items} items</p>
                <button className="mt-4 text-yellow-500 font-semibold hover:text-yellow-400 transition-colors">
                  Explore Collection →
                </button>
              </div>

              
              <div className="absolute inset-0 bg-yellow-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

export default DesignerShowcase