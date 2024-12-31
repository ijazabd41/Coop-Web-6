import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { FaChevronRight } from 'react-icons/fa';
import Link from 'next/link';

const BreadCrumb = () => {
    const router = useRouter();
    const [breadcrumbs, setBreadcrumbs] = useState([]);
    const { slug } = router.query;
    useEffect(() => {
        if (router.pathname) {
            const pathArray = router.asPath.split('?')[0].split('/').filter((path) => path);
            const formattedBreadcrumbs = pathArray.map((path, index) => {
                const href = `/${pathArray.slice(0, index + 1).join('/')}`;
                return { label: decodeURIComponent(path), href };
            });
            setBreadcrumbs(formattedBreadcrumbs);
        }
    }, [router.pathname, router.asPath]);

    return (
        <section className="p-3 md:p-6 breadCrumbBg">
            <div className=" container">
                <div className='flex justify-between flex-col gap-1 md:flex-row'>
                    <p className="text-xl font-bold capitalize">
                        {breadcrumbs.length ? slug ? breadcrumbs[breadcrumbs.length - 2]?.label : breadcrumbs[breadcrumbs.length - 1]?.label : 'Home'}
                    </p>
                    <div className="flex gap-1 items-center overflow-hidden ">
                        <Link href="/" className="text-sm font-bold capitalize">
                            Home
                        </Link>

                        {breadcrumbs.map((crumb, index) => (
                            <div key={crumb.href} className="flex items-center gap-1 max-w-[150px]">
                                <FaChevronRight size={14} />
                                {index === breadcrumbs.length - 1 ? (
                                    <span
                                        className="text-sm font-bold capitalize cursor-pointer text-ellipsis overflow-hidden whitespace-nowrap"
                                        style={{ maxWidth: '100%' }}
                                        title={crumb.label} // Tooltip to show full text on hover
                                    >
                                        {crumb.label}
                                    </span>
                                ) : (
                                    <Link
                                        href={crumb?.href === "/product" ? "/products" : crumb.href}
                                        className="text-sm font-bold capitalize text-ellipsis overflow-hidden whitespace-nowrap"
                                        style={{ maxWidth: '100%' }}
                                        title={crumb.label} // Tooltip to show full text on hover
                                    >
                                        {crumb.label}
                                    </Link>
                                )}
                            </div>

                        ))}


                    </div>
                </div>

            </div>
        </section>
    );
};

export default BreadCrumb;
