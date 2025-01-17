import React, { useEffect } from 'react'
import Loader from '../loader/Loader'
import { useSelector } from 'react-redux'
import FeatureSections from '../homepagefaturesection/FeatureSections'
import HomeAllProducts from '../homepagefaturesection/HomeAllProducts'


const HomePage = () => {

    const setting = useSelector(state => state.Setting)
    const language = useSelector(state => state.Language.selectedLanguage)

    useEffect(() => { }, [language])


    return (
        <>
            <div>
                {setting?.setting == null ? <Loader /> :
                    <>
                        <FeatureSections />
                        <HomeAllProducts />
                    </>
                }
            </div>
        </>
    )
}

export default HomePage