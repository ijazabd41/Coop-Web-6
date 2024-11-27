import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { FaChevronRight } from 'react-icons/fa';
import Link from 'next/link';

const BreadCrumb = () => {
    const router = useRouter();
    const [breadcrumbs, setBreadcrumbs] = useState([]);

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
        <section className="p-6 breadCrumbBg">
            <div className="flex justify-between container">
                <p className="text-xl font-bold capitalize">
                    {breadcrumbs.length ? breadcrumbs[breadcrumbs.length - 1]?.label : 'Home'}
                </p>
                <div className="flex gap-1 items-center">
                    <Link href="/" className="text-sm font-bold capitalize">
                        Home
                    </Link>
                    {breadcrumbs.map((crumb, index) => (
                        <div key={crumb.href} className="flex items-center gap-1">
                            {console.log("crumb", crumb)}
                            <FaChevronRight size={14} />
                            {index === breadcrumbs.length - 1 ? (
                                <span className="text-sm font-bold capitalize cursor-pointer">{crumb.label}</span>
                            ) : (
                                <Link href={crumb.href} className="text-sm font-normal capitalize">
                                    {crumb.label}
                                </Link>
                            )}
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default BreadCrumb;
