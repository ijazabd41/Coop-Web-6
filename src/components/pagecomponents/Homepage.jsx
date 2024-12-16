import React, { useEffect, useState } from 'react'
import Home from '@/components/homepage/Home'
import * as api from "@/api/apiRoutes"
import { setShop } from '@/redux/slices/shopSlice'
import { useSelector, useDispatch } from 'react-redux'
import Categories from '../categories/Categories'
import Loader from '../loader/Loader'
import Layout from '../layout/Layout'
import { setSetting } from '@/redux/slices/settingSlice'

const Homepage = () => {

    

    const [loading, setLoading] = useState(false)




    return (
        <div>
            {loading == true ? <Loader screen='full' /> :
                <Layout>
                    <Home />
                </Layout>
            }


        </div>
    )
}


export default Homepage