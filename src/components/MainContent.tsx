import { useEffect, useState } from 'react';
import { useFilter } from './FilterContext';
import { Tally3 } from 'lucide-react';
import axios from 'axios';

interface Product {
  category: string;
  price: number;
  title: string;
  rating: number;
}

const MainContent = () => {
  const { searchQuery, selectedCategory, minPrice, maxPrice, keyword } = useFilter();
  const [products, setProducts] = useState<any[]>([]);
  const [filter, setFilter] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const itemsPerPage = 10;

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const url = keyword
          ? `https://dummyjson.com/products/search?q=${keyword}`
          : `https://dummyjson.com/products?limit=${itemsPerPage}&skip=${
              (currentPage - 1) * itemsPerPage
            }`;

        const { data } = await axios.get(url);
        setProducts(data.products);
        console.log('Products:', data.products);
      } catch (error: any) {
        console.error('Error fetching products:', error.response || error.message);
      }
    };

    fetchProducts();
  }, [currentPage, keyword]);

  const getFilteredProducts = (): Product[] => {
    return products
      .filter(filterByCategory)
      .filter(filterByMinPrice)
      .filter(filterByMaxPrice)
      .filter(filterBySearchQuery);
  };

  // Funções separadas para cada filtro com o tipo Product
  const filterByCategory = (product: Product): boolean => {
    return !selectedCategory || product.category === selectedCategory;
  };

  const filterByMinPrice = (product: Product): boolean => {
    return minPrice === undefined || product.price >= minPrice;
  };

  const filterByMaxPrice = (product: Product): boolean => {
    return maxPrice === undefined || product.price <= maxPrice;
  };

  const filterBySearchQuery = (product: Product): boolean => {
    return (
      !searchQuery ||
      product.title.toLocaleLowerCase().includes(searchQuery.toLocaleLowerCase())
    );
  };
  const sortProducts = (filteredProducts: Product[]): Product[] => {
    switch (filter) {
      case 'expensive':
        return filteredProducts.sort((a, b) => b.price - a.price);
      case 'cheap':
        return filteredProducts.sort((a, b) => a.price - b.price);
      case 'popular':
        return filteredProducts.sort((a, b) => b.rating - a.rating);
      default:
        return filteredProducts;
    }
  };

  const filteredProducts = sortProducts(getFilteredProducts());
  console.log('Filtered Products:', filteredProducts);

  return (
    <section className='xl:w-[55rem] lg:w-[55rem] sm:w-[40rem] xs:w-[20rem] p-5'>
      <div className='mb-5'>
        <div className='flex flex-col sm:flex-row justify-between items-center'>
          <div className='relative mb-5 mt-5'>
            <button
              className='border px-4 py-2 rounded-full flex items-center'
              onClick={() => {
                setDropdownOpen(true);
              }}>
              <Tally3 className='mr-2' size={24} />
              {/*  */}
              {filter === 'all'
                ? 'Filter'
                : filter.charAt(0).toLocaleLowerCase() + filter.slice(1)}
            </button>

            {dropdownOpen && (
              <div className='absolute bg-white border border-grey-300 rounded mt-2 w-full sm:w-40'>
                <button
                  className='block w-full text-left px-4 py-2 text-left hover:bg-gray-200'
                  onClick={() => {
                    setFilter('cheap');
                    setDropdownOpen(false);
                  }}>
                  Cheap
                </button>
                <button
                  className='block w-full text-left px-4 py-2 text-left hover:bg-gray-200'
                  onClick={() => {
                    setFilter('expensive');
                    setDropdownOpen(false);
                  }}>
                  expensive
                </button>
                <button
                  className='block w-full text-left px-4 py-2 text-left hover:bg-gray-200'
                  onClick={() => {
                    setFilter('popular');
                    setDropdownOpen(false);
                  }}>
                  popular
                </button>
              </div>
            )}
          </div>
        </div>
        {/* Card */}
        <div className='grid grid-cols-4 sm:grid-cols-3 md:grid-cols-4 gap-5'>
          {/* BookCard */}
        </div>
      </div>
    </section>
  );
};

export default MainContent;
