import React, { PropsWithChildren } from 'react'
import Header from './Header'
import Footer from './Footer'
const Layout = ({ children }) => {
    return (
        <section>
            <Header />
            {children}
            <Footer />
        </section>
    )
}

export default Layout