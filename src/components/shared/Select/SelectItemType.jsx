import { Controller } from 'react-hook-form';
import ReactSelectError from './ReactSelectError';
import SelectCustom from './SelectCustom';
import { useGetItemTypesQuery } from '@/store/api/app/ApplicationSetting/itemTypeApiSlice';

const SelectItemType = ({
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
	const { data, isLoading } = useGetItemTypesQuery()

	const options = data?.data?.map((item) => ({
		value: item.id,
		label: item.title,
	}));

	if (isLoading) {
		return <div>Loading...</div>;
	}

	return (
		<>
			<Controller
				name={name || 'item_type_id'}
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
				// rules={{ required: 'Item Type is required!' }}
			/>
			<ReactSelectError errorName={errors?.[name ? name : 'item_type_id']} />
		</>
	);
};

export default SelectItemType;
