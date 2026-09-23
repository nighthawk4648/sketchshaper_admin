import envConfig from "@/configs/envConfig";
import { useEffect, useRef, useState } from "react";
import { Controller } from "react-hook-form";

const Fileinput = ({
  name,
  label = "Browse",
  onChange,
  placeholder = "Choose a file or drop it here...",
  multiple,
  preview,
  className = "custom-class",
  id,
  selectedFile,
  badge,
  selectedFiles,
  control,
  defaultUrl,
  classLabel,
  horizontal,
  onClear,
  onRemoveFile,
}) => {
  const [isDefaultCleared, setIsDefaultCleared] = useState(false);
  const nativeInputRef = useRef(null);

  useEffect(() => {
    setIsDefaultCleared(false);
  }, [defaultUrl]);

  return (
    <div>
      <label
        className={`block capitalize ${classLabel}  ${
          horizontal ? "flex-0 mr-6 md:w-[100px] w-[60px] break-words" : ""
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
              const fileToShow =
                selectedFile || (value && value.length > 0 ? value[0] : null);
              const displayFileName = fileToShow?.name || selectedFile?.name;

              // Check if fileToShow is a valid File/Blob object
              const isValidFile =
                fileToShow &&
                (fileToShow instanceof File || fileToShow instanceof Blob);

              return (
                <>
                  <input
                    className="bg-red-400 w-full hidden"
                    type="file"
                    onChange={(e) => {
                      setIsDefaultCleared(false);
                      onChange(e.target.files); // update value with selected files
                    }}
                    onBlur={onBlur}
                    name={name}
                    id={id}
                    ref={(node) => {
                      ref(node);
                      nativeInputRef.current = node;
                    }}
                    multiple={multiple}
                    placeholder={placeholder}
                  />
                  <div
                    className={`w-full h-[40px] file-control flex items-center ${className}`}
                  >
                    {!multiple && (
                      <span className="flex-1 overflow-hidden text-ellipsis whitespace-nowrap">
                        {displayFileName && !isDefaultCleared && (
                          <span
                            className={
                              badge
                                ? " badge-title"
                                : "text-slate-900 dark:text-white"
                            }
                          >
                            {displayFileName}
                          </span>
                        )}
                        {(!displayFileName || isDefaultCleared) && (
                          <span className="text-slate-400">{placeholder}</span>
                        )}
                      </span>
                    )}

                    {multiple && (
                      <span className="flex-1 overflow-hidden text-ellipsis whitespace-nowrap">
                        {selectedFiles && selectedFiles.length > 0 && (
                          <span
                            className={
                              badge
                                ? " badge-title"
                                : "text-slate-900 dark:text-white"
                            }
                          >
                            {selectedFiles.length > 0
                              ? selectedFiles.length + " files selected"
                              : ""}
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
                  {/* Staged new file preview — with top-right (X) button */}
                  {!multiple && preview && isValidFile && (
                    <div className="relative w-[200px] h-[200px] mx-auto mt-6 group">
                      <button
                        type="button"
                        title="Remove selected image"
                        onClick={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                          onChange(null);
                          if (nativeInputRef.current) {
                            nativeInputRef.current.value = "";
                          }
                          if (onClear) onClear();
                        }}
                        className="absolute -top-2.5 -right-2.5 z-20 w-7 h-7 rounded-full bg-red-500 hover:bg-red-600 text-white flex items-center justify-center shadow-lg hover:scale-110 transition-all cursor-pointer border-2 border-white dark:border-slate-800"
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          viewBox="0 0 20 20"
                          fill="currentColor"
                          className="w-4 h-4"
                        >
                          <path d="M6.28 5.22a.75.75 0 0 0-1.06 1.06L8.94 10l-3.72 3.72a.75.75 0 1 0 1.06 1.06L10 11.06l3.72 3.72a.75.75 0 1 0 1.06-1.06L11.06 10l3.72-3.72a.75.75 0 0 0-1.06-1.06L10 8.94 6.28 5.22Z" />
                        </svg>
                      </button>
                      <img
                        src={URL.createObjectURL(fileToShow)}
                        className="w-full h-full block rounded-lg object-contain border p-2 border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800"
                        alt={fileToShow?.name}
                      />
                    </div>
                  )}
                  {/* Default existing image from DB — with top-right (X) button */}
                  {!multiple &&
                    preview &&
                    !isValidFile &&
                    defaultUrl &&
                    !isDefaultCleared && (
                      <div className="relative w-[200px] h-[200px] mx-auto mt-6 group">
                        <button
                          type="button"
                          title="Remove this image"
                          onClick={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            setIsDefaultCleared(true);
                            onChange(null);
                            if (nativeInputRef.current) {
                              nativeInputRef.current.value = "";
                            }
                            if (onClear) onClear();
                          }}
                          className="absolute -top-2.5 -right-2.5 z-20 w-7 h-7 rounded-full bg-red-500 hover:bg-red-600 text-white flex items-center justify-center shadow-lg hover:scale-110 transition-all cursor-pointer border-2 border-white dark:border-slate-800"
                        >
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            viewBox="0 0 20 20"
                            fill="currentColor"
                            className="w-4 h-4"
                          >
                            <path d="M6.28 5.22a.75.75 0 0 0-1.06 1.06L8.94 10l-3.72 3.72a.75.75 0 1 0 1.06 1.06L10 11.06l3.72 3.72a.75.75 0 1 0 1.06-1.06L11.06 10l3.72-3.72a.75.75 0 0 0-1.06-1.06L10 8.94 6.28 5.22Z" />
                          </svg>
                        </button>
                        <img
                          src={envConfig.apiImgUrl + defaultUrl}
                          className="w-full h-full block rounded-lg object-contain border p-2 border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800"
                          alt="preview"
                        />
                      </div>
                    )}
                  {multiple &&
                    preview &&
                    selectedFiles &&
                    selectedFiles.length > 0 && (
                      <div className="flex flex-wrap space-x-5 rtl:space-x-reverse mt-6">
                        {selectedFiles.map((file, index) => (
                          <div
                            className="relative xl:w-1/5 md:w-1/3 w-1/2 rounded border p-2 border-slate-200 dark:border-slate-700"
                            key={index}
                          >
                            <button
                              type="button"
                              title="Remove image"
                              onClick={(e) => {
                                e.preventDefault();
                                e.stopPropagation();
                                if (onRemoveFile) onRemoveFile(index);
                              }}
                              className="absolute -top-2 -right-2 z-20 w-6 h-6 rounded-full bg-red-500 hover:bg-red-600 text-white flex items-center justify-center shadow hover:scale-110 transition-all cursor-pointer border-2 border-white dark:border-slate-800"
                            >
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                viewBox="0 0 20 20"
                                fill="currentColor"
                                className="w-3.5 h-3.5"
                              >
                                <path d="M6.28 5.22a.75.75 0 0 0-1.06 1.06L8.94 10l-3.72 3.72a.75.75 0 1 0 1.06 1.06L10 11.06l3.72 3.72a.75.75 0 1 0 1.06-1.06L11.06 10l3.72-3.72a.75.75 0 0 0-1.06-1.06L10 8.94 6.28 5.22Z" />
                              </svg>
                            </button>
                            <img
                              src={
                                file instanceof File || file instanceof Blob
                                  ? URL.createObjectURL(file)
                                  : ""
                              }
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
