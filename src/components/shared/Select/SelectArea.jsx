
import { Controller } from 'react-hook-form';
import ReactSelectError from './ReactSelectError';
import SelectCustom from './SelectCustom';
import { useGetAreaByDistrictIdQuery } from '@/store/api/app/ApplicationSetting/Area/areaApiSlice';

const SelectArea = ({
    errors,
    control,
    setState,
    setItem,
    state,
    defaultValue,
    isMarked,
    isDisabled,
    name,
    districtId,
}) => {


    const { data, isLoading } = useGetAreaByDistrictIdQuery(districtId)

    const options = data?.data?.map((item) => ({
        value: item.id,
        label: item.name,
    }));

    if (isLoading) {
        return <div>Loading...</div>;
    }

    return (
        <>
            <Controller
                name={name || 'area_id'}
                control={control}
                defaultValue={defaultValue}
                render={({ field: { onChange, onBlur, value, ref } }) => (
                    <SelectCustom
                        isMarked={isMarked}
                        defaultValue={defaultValue}
                        options={options}
                        onChange={onChange}
                        setState={setState}
                        setItem={setItem}
                        isDisabled={isDisabled}
                    />
                )}
                // rules={{ required: 'Area is required!' }}
            />
            <ReactSelectError errorName={errors?.[name ? name : 'area_id']} />
        </>
    );
};

export default SelectArea;
