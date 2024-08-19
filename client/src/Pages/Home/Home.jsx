import Banner from '../../Component/Banner/Banner'
import Categories from '../../Component/Categories/Categories'
import Footer from '../../Component/Footer/Footer'
import MobileNav from '../../Component/MobileNav/MobileNav'
import Navbar from '../../Component/Navbar/Navbar'
import ProductStore from '../../Component/ProductStore/ProductStore'
import { useFetchCategory, useFetchProduct } from '../../Helpers/fetch.hooks'
import { bannerData } from '../../data.js/banner'
import { categories } from '../../data.js/categories'
import { storeData } from '../../data.js/store'
import './Home.css'

function Home() {
  //call the top 10 latest product frrom the data base and pass it to the store data
  //call the categories data and pass it
  //call banner data and pass it
  const { isLoadingProduct, productData  } = useFetchProduct();
  const data = productData?.data
  const sortedStoreData = data?.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
  const latestStoreData = sortedStoreData?.slice(0, 12);

  const { isLoadingCat, catData } = useFetchCategory()
  const categories = catData?.data

  return (
    <div className='bg home'>
      <Navbar />
      <div className="mNav">
        <MobileNav />
      </div>
      <div className="container">
        <Banner data={bannerData} />
        <div className="categoriesContainer">
          <Categories 
            data={categories} 
            isLoadingCat={isLoadingCat}
          />
        </div>

        <div className="productStoreContainer">
          <ProductStore 
            storeData={latestStoreData} 
            options={true}
            isLoadingProduct={isLoadingProduct}
          />
        </div>
      </div>

      <Footer />
    </div>
  )
}

export default Home