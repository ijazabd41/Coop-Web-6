import React, { useEffect } from 'react'
import Loader from '../loader/Loader'
import { useSelector } from 'react-redux'
import FeatureSections from '../homepagefaturesection/FeatureSections'
import HomeAllProducts from '../homepagefaturesection/HomeAllProducts'
import HomeOfferModal from '../homepageoffermodal/HomeOfferModal'


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
                        {setting.setting && setting?.setting?.popup_enabled === "1" &&
                            <HomeOfferModal />
                        }
                    </>
                }
            </div>
        </>
    )
}

export default HomePage