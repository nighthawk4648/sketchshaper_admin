import { useGetCategoriesQuery } from '@/store/api/app/Category/categoryApiSlice';
import { Controller } from 'react-hook-form';
import ReactSelectError from './ReactSelectError';
import SelectCustom from './SelectCustom';

const SelectCategory = ({
    errors,
    control,
    setState,
    setItem,
    state,
    defaultValue,
    isMarked,
    isDisabled,
    name,
    
}) => {


    const { data, isLoading } = useGetCategoriesQuery()

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
                name={name || 'category_id'}
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
                rules={{ required: 'Category is required!' }}
            />
            <ReactSelectError errorName={errors?.[name ? name : 'category']} />
        </>
    );
};

export default SelectCategory;
