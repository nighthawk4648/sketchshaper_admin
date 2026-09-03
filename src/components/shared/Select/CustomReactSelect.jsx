import { Controller } from 'react-hook-form';
import Select from 'react-select';

const styles = {
	option: (provided, state) => ({
		...provided,
		fontSize: '14px',
	}),
};

const CustomReactSelect = ({
	name,
	placeholder,
	label,
	required,
	options,
	control,
	isMulti,
	error,
	isLoading,
	isDisabled,
}) => {
	return (
		<div>
			<label htmlFor="custom-react-select" className="form-label ">
				{label}
			</label>
			<div className={error ? 'has-error' : ''}>
				<Controller
					name={name}
					control={control}
					rules={{
						required: required ? `${label} is required!` : false,
					}}
					render={({ field: { onChange, onBlur, value, name, ref } }) => (
						<Select
							isLoading={isLoading}
							loadingMessage={() => 'Loading...'}
							placeholder={placeholder}
							className="react-select"
							classNamePrefix="select"
							value={
								isMulti
									? options.filter((option) => value?.includes(option.value))
									: options.find((option) => option.value === value)
							}
							onChange={
								isMulti
									? (value) => {
											onChange(value ? value.map((item) => item.value) : []);
									  }
									: (value) => {
											onChange(value ? value.value : '');
									  }
							}
							styles={styles}
							options={options}
							isClearable
							isMulti={isMulti}
							id="custom-react-select"
							isDisabled={isDisabled}
						/>
					)}
				/>
			</div>

			{error && (
				<div className={` mt-2 text-danger-500 block text-sm`}>
					{error.message}
				</div>
			)}
		</div>
	);
};

export default CustomReactSelect;
