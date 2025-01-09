import * as Slider from "@radix-ui/react-slider";
import Skeleton from "react-loading-skeleton";

export default ({ values, setValues, minPrice, maxPrice, setTempMinPrice, setTempMaxPrice }) => {
    if (
        minPrice === null ||
        maxPrice === null ||
        typeof minPrice === "undefined" ||
        typeof maxPrice === "undefined"
    ) {
        return <div className="w-full"><Skeleton height={15} /></div>; // Display a loading message or spinner
    }
    return (
        <div className="w-full">
            {console.log(values,
                minPrice,
                maxPrice)}
            <Slider.Root
                defaultValue={[minPrice, maxPrice]}
                min={minPrice}
                max={maxPrice}
                values={values?.length == 0 ? [minPrice, maxPrice] : values}
                step={0.01}
                // minStepsBetweenThumbs={0.01}
                className="relative flex h-15 w-full touch-none select-none items-center"
                onValueChange={(newValues) => {
                    console.log("In value change:", newValues)
                    setValues(newValues);
                }}
                onValueCommit={(newValues) => {
                    console.log("In value commit:", newValues)
                    setTempMinPrice(newValues[0]);
                    setTempMaxPrice(newValues[1]);
                }}
            >
                <Slider.Track className="relative h-[15px] w-full grow rounded-full bg-white border border-gray-200">
                    <Slider.Range className="absolute h-full rounded-full bg-green-600" />
                </Slider.Track>
                <Slider.Thumb
                    className="w-[25px] h-[25px] absolute top-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full primaryBackColor border-4 border-white drop-shadow-md focus:outline-none cursor-pointer"
                />
                <Slider.Thumb
                    className="w-[25px] h-[25px] absolute top-1/2 -translate-x-1/2 -translate-y-1/2  rounded-full primaryBackColor border-4 border-white drop-shadow-md focus:outline-none cursor-pointer"
                />
            </Slider.Root>
        </div>
    )
};
