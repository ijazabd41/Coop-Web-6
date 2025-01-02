import { useState, useEffect } from "react"
import { Collapse, Slider, Checkbox, Tree } from "antd/lib";
import { useDispatch, useSelector } from "react-redux";
import { setFilterCategory, clearAllFilter, setFilterBrands, setFilterMinMaxPrice } from "@/redux/slices/productFilterSlice";
import * as api from "@/api/apiRoutes";
import { t } from "@/utils/translation"
import { FiPlus, FiMinus } from "react-icons/fi";

const Filter = ({ setProductResult, setOffset, minPrice, maxPrice, values, setValues, setMinPrice, setMaxPrice, setShowFilter }) => {
    const filter = useSelector(state => state.ProductFilter)
    const dispatch = useDispatch();
    const [categories, setCategories] = useState(null)
    const [treeData, setTreeData] = useState([]);
    const [expandedKeys, setExpandedKeys] = useState([]);
    const [selectedCategories, setSelectedCategories] = useState([])
    const [brands, setbrands] = useState(null)
    const [totalBrands, setTotalBrands] = useState()
    const [brandOffset, setBrandOffset] = useState(0);
    const [tempMinPrice, setTempMinPrice] = useState(null)
    const [tempMaxPrice, setTempMaxPrice] = useState(null)
    const brandLimit = 10;




    useEffect(() => {
        if (brands == null) {
            fetchBrands(0)
        }
        if (categories == null) {
            fetchCategories()
        }
    }, [])

    useEffect(() => {
        const categories = filter.category_id?.split(",")
        const catNum = categories?.map((cat) => (parseInt(cat)))
        setSelectedCategories(catNum)
    }, [])

    useEffect(() => {
        if (categories?.length > 0) {
            const cat = transformCategoryData(categories);
            setTreeData(cat);
        }
    }, [categories]);



    const fetchCategories = async () => {
        try {
            const categories = await api.getCategories()
            setCategories(categories.data)
        } catch (error) {
            console.log("erorr", error)
        }
    }

    const transformCategoryData = (categories) => {
        return categories?.map(category => ({
            title: category.name,
            key: category.id,
            children: category.cat_active_childs.length > 0
                ? transformCategoryData(category.cat_active_childs)
                : []
        }));
    };

    const onExpand = (expandedKeysValue) => {
        setExpandedKeys(expandedKeysValue);
    };

    const handleExpandCollapse = (node) => {
        const newExpandedKeys = expandedKeys.includes(node.key)
            ? expandedKeys.filter(key => key !== node.key)
            : [...expandedKeys, node.key];
        setExpandedKeys(newExpandedKeys);
    };

    const renderTitle = (node) => {
        const isExpanded = expandedKeys.includes(node.key);
        const hasChildren = node.children && node.children.length > 0;

        return (
            <div className='flex  items-center gap-2'>
                <div className="text-sm font-normal">{node.title}{' '}</div>
                {hasChildren && (
                    isExpanded
                        ? <FiMinus size={18} onClick={() => handleExpandCollapse(node)} />
                        : <FiPlus size={18} onClick={() => handleExpandCollapse(node)} />
                )}
            </div>
        );
    };

    const renderTreeNodes = (data) =>
        data?.map((item) => ({
            ...item,
            title: renderTitle(item),
            children: item.children.length > 0 ? renderTreeNodes(item.children) : [],
        }));

    const onCheck = (catIds) => {
        setProductResult([])
        setOffset(0)
        setSelectedCategories(catIds)
        dispatch(setFilterCategory({ data: catIds.join(",") }));
    }


    const fetchBrands = async (bOffset) => {
        try {
            const result = await api.getBrands({ limit: brandLimit, offset: bOffset });
            if (result.status === 1) {
                if (brands == null) {
                    setbrands(result?.data)
                } else {
                    setbrands(prevBrands => [...prevBrands, ...result?.data]);
                }
                setTotalBrands(result?.total)
            }
        } catch (error) {
            console.log("Error", error)
        }
    };

    const filterbyBrands = (brand) => {
        var brand_ids = [...filter.brand_ids];
        if (brand_ids.includes(brand.id)) {
            brand_ids.splice(brand_ids.indexOf(brand.id), 1);
        }
        else {
            brand_ids.push(parseInt(brand.id));
        }
        const sorted_brand_ids = sort_unique_brand_ids(brand_ids);
        dispatch(setFilterBrands({ data: sorted_brand_ids }));
    };

    const sort_unique_brand_ids = (int_brand_ids) => {
        if (int_brand_ids.length === 0) return int_brand_ids;
        int_brand_ids = int_brand_ids.sort(function (a, b) { return a * 1 - b * 1; });
        var ret = [int_brand_ids[0]];
        for (var i = 1; i < int_brand_ids.length; i++) { //Start loop at 1: arr[0] can never be a duplicate
            if (int_brand_ids[i - 1] !== int_brand_ids[i]) {
                ret.push(int_brand_ids[i]);
            }
        }
        return ret;
    };

    const loadMoreBrands = () => {
        setBrandOffset(prevOffset => prevOffset + brandLimit);
        fetchBrands(brandOffset + brandLimit) // Increase offset to fetch next set of brands
    };




    return (
        <>
            <div className="md:cardBorder rounded-md headerBackgroundColor ">
                <div className='md:p-4 bottomBorder '>
                    <div className='flex justify-between items-center  '>
                        <h5 className="text-xl font-bold">{t("filters")}</h5>
                        <p className='m-0 text-sm font-normal text-[#DB3D26] cursor-pointer'
                            onClick={() => {
                                setSelectedCategories([]);
                                setMinPrice(null);
                                setMaxPrice(null);
                                dispatch(clearAllFilter());
                                setOffset(0)
                                setProductResult([])
                            }}
                        >
                            {t("clearAll")}
                        </p>
                    </div>
                </div>
                <Collapse defaultActiveKey={["1", "2", "3"]} className="">
                    <Collapse.Panel header={t("product_category")} key="1" className="text-base font-semibold  textColor">
                        <div className='filter-row '>
                            <Tree
                                checkable
                                treeData={renderTreeNodes(treeData)}
                                expandedKeys={expandedKeys}
                                onExpand={onExpand}
                                defaultExpandAll={false}
                                onCheck={onCheck}
                                checkedKeys={selectedCategories}
                                showLine={false}
                                switcherIcon={null}
                                className="textColor"
                            />
                            {/* <CategoryComponent data={category} selectedCategories={selectedCategories} setSelectedCategories={setSelectedCategories} setproductresult={setproductresult} setoffset={setoffset} /> */}
                        </div>
                    </Collapse.Panel>

                    {brands?.length <= 0 ? null : <Collapse.Panel header={t("brands")} key="2" className="text-base font-semibold ">
                        <div className='filter-row'>
                            {
                                // brands == null ? (<Loader />) :
                                brands?.map((brand, index) => {
                                    const isChecked = filter.brand_ids.includes(brand.id);
                                    return (
                                        <div key={brand.id}>
                                            <Checkbox
                                                checked={isChecked}
                                                onChange={() => {
                                                    setProductResult([])
                                                    filterbyBrands(brand)
                                                }}

                                            >
                                                <Checkbox.Group>
                                                </Checkbox.Group>
                                            </Checkbox>
                                            <span className="text-sm font-normal textColor">{brand.name}</span>
                                        </div>
                                    );
                                })
                            }
                            {brands?.length < totalBrands ? <a className='brand-view-more textColor' onClick={loadMoreBrands}>{t("showMore")}</a> : <></>}

                        </div>
                    </Collapse.Panel>

                    }

                    <Collapse.Panel header={t("priceRange")} key="3">
                        <div>
                            <Slider range min={minPrice}
                                max={maxPrice} step={0.01} onChange={(newValues) => {
                                    setValues(newValues);
                                }}
                                value={values}
                                onChangeComplete={
                                    (newValues) => {
                                        setTempMinPrice(newValues[0])
                                        setTempMaxPrice(newValues[1])
                                    }
                                }
                            />
                            <div className='range-prices'>
                                <p>${values[0]}</p>
                                <p>${values[1]}</p>
                                {/* <p>{setting?.setting?.currency}{values[0]}</p> */}
                                {/* <p>{setting?.setting?.currency}{values[1]}</p> */}
                            </div>
                            <button className="price-filter-apply-btn" onClick={(newValues) => {
                                setOffset(0)
                                setProductResult([])
                                dispatch(setFilterMinMaxPrice({ data: { min_price: tempMinPrice, max_price: tempMaxPrice } }))
                            }}>
                                Apply
                            </button>
                        </div>
                    </Collapse.Panel>
                </Collapse>

            </div >

        </>
    );
};

export default Filter;