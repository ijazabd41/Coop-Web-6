import React from 'react'
import Loader from '../loader/Loader'
import { useSelector } from 'react-redux'

import FeatureSections from '../homepagefaturesection/FeatureSections'

const HomePage = () => {

    const setting = useSelector(state => state.Setting)
    return (
        <>
            <div>
                {setting?.setting == null ? <Loader /> : <FeatureSections />}

            </div>
        </>
    )
}

export default HomePage