import envConfig from '@/configs/envConfig';
import { Controller } from 'react-hook-form';

const Fileinput = ({
	name,
	label = 'Browse',
	onChange,
	placeholder = 'Choose a file or drop it here...',
	multiple,
	preview,
	className = 'custom-class',
	id,
	selectedFile,
	badge,
	selectedFiles,
	control,
	defaultUrl,
	classLabel,
	horizontal,
}) => {
	console.log('ddd',selectedFile)
	
	return (
		<div>
			<label
				className={`block capitalize ${classLabel}  ${
					horizontal ? 'flex-0 mr-6 md:w-[100px] w-[60px] break-words' : ''
				}`}
			>
				{label}
			</label>

			<div className="filegroup mt-2">
				<label>
					<Controller
						name={name}
						control={control}
						render={({ field: { onChange, onBlur, value, name, ref } }) => {
							// Use the value from Controller if selectedFile is not provided
							const fileToShow = selectedFile || (value && value.length > 0 ? value[0] : null);
							const displayFileName = fileToShow?.name || (selectedFile?.name);
							
							// Check if fileToShow is a valid File/Blob object
							const isValidFile = fileToShow && (fileToShow instanceof File || fileToShow instanceof Blob);
							
							return (
								<>
									<input
										className="bg-red-400 w-full hidden"
										type="file"
										onChange={(e) => {
											onChange(e.target.files); // update value with selected files
										}}
										onBlur={onBlur}
										name={name}
										id={id}
										ref={ref} // assign the ref
										multiple={multiple}
										placeholder={placeholder}
									/>
									<div
										className={`w-full h-[40px] file-control flex items-center ${className}`}
									>
										{!multiple && (
											<span className="flex-1 overflow-hidden text-ellipsis whitespace-nowrap">
												{displayFileName && (
													<span
														className={
															badge ? ' badge-title' : 'text-slate-900 dark:text-white'
														}
													>
														{displayFileName}
													</span>
												)}
												{!displayFileName && (
													<span className="text-slate-400">{placeholder}</span>
												)}
											</span>
										)}

										{multiple && (
											<span className="flex-1 overflow-hidden text-ellipsis whitespace-nowrap">
												{selectedFiles && selectedFiles.length > 0 && (
													<span
														className={
															badge ? ' badge-title' : 'text-slate-900 dark:text-white'
														}
													>
														{selectedFiles.length > 0
															? selectedFiles.length + ' files selected'
															: ''}
													</span>
												)}
												{(!selectedFiles || selectedFiles.length === 0) && (
													<span className="text-slate-400">{placeholder}</span>
												)}
											</span>
										)}
										<span className="file-name flex-none cursor-pointer border-l px-4 border-slate-200 dark:border-slate-700 h-full inline-flex items-center bg-slate-100 dark:bg-slate-900 text-slate-600 dark:text-slate-400 text-base rounded-tr rounded-br font-normal">
											{label}
										</span>
									</div>
									{/* Store the file for preview */}
									{!multiple && preview && isValidFile && (
										<div className="w-[200px] h-[200px] mx-auto mt-6">
											<img
												src={URL.createObjectURL(fileToShow)}
												className="w-full h-full block rounded object-contain border p-2 border-slate-200"
												alt={fileToShow?.name}
											/>
										</div>
									)}
									{!multiple && preview && !isValidFile && defaultUrl && (
										<div className="w-[200px] h-[200px] mx-auto mt-6">
											<img
												src={envConfig.apiImgUrl + defaultUrl}
												className="w-full h-full block rounded object-contain border p-2 border-slate-200"
												alt="preview"
											/>
										</div>
									)}
									{multiple && preview && selectedFiles && selectedFiles.length > 0 && (
										<div className="flex flex-wrap space-x-5 rtl:space-x-reverse mt-6">
											{selectedFiles.map((file, index) => (
												<div
													className="xl:w-1/5 md:w-1/3 w-1/2 rounded border p-2 border-slate-200"
													key={index}
												>
													<img
														src={file instanceof File || file instanceof Blob ? URL.createObjectURL(file) : ''}
														className="object-cover w-full h-full rounded"
														alt={file?.name}
													/>
												</div>
											))}
										</div>
									)}
								</>
							);
						}}
					/>
				</label>
			</div>
		</div>
	);
};

export default Fileinput;
