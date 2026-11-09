import envConfig from "@/configs/envConfig";
import { useSearchAssetsLiteQuery } from "@/store/api/app/Assets/assetsApiSlice";
import { useEffect, useRef, useState } from "react";

const MAX_LINKED = 25;

const coverUrl = (cover) =>
  cover
    ? `${envConfig.apiImgUrl || "http://localhost:5000/api/uploads/"}${cover}`
    : "";

const AccessBadge = ({ type }) => (
  <span
    className={`shrink-0 text-[10px] font-medium px-1.5 py-0.5 rounded ${
      type === "paid"
        ? "bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-300"
        : "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300"
    }`}
  >
    {type === "paid" ? "PRO" : "Free"}
  </span>
);

const Thumb = ({ cover, size }) => (
  <img
    src={coverUrl(cover)}
    alt=""
    style={{ width: size, height: size }}
    className="shrink-0 rounded object-cover bg-slate-200 dark:bg-slate-700"
  />
);

/**
 * Search-and-attach box for linking assets (textures, materials, models).
 *
 * Props:
 *  - selectedAssets: array of assets ({ id, name, cover, access_type, sub_category })
 *  - onChange(nextAssets)
 *  - excludeAssetId: asset that must not be linkable to itself (optional)
 */
const LinkedAssetSelector = ({
  selectedAssets = [],
  onChange,
  excludeAssetId,
}) => {
  const [term, setTerm] = useState("");
  const [debounced, setDebounced] = useState("");
  const [open, setOpen] = useState(false);
  const wrapRef = useRef(null);

  useEffect(() => {
    const t = setTimeout(() => setDebounced(term.trim()), 300);
    return () => clearTimeout(t);
  }, [term]);

  useEffect(() => {
    const onDocClick = (e) => {
      if (wrapRef.current && !wrapRef.current.contains(e.target)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", onDocClick);
    return () => document.removeEventListener("mousedown", onDocClick);
  }, []);

  const { data, isFetching } = useSearchAssetsLiteQuery(
    { search: debounced, excludeId: excludeAssetId },
    { skip: !open },
  );

  const selectedIds = new Set(selectedAssets.map((a) => a.id));
  const results = (data?.data || []).filter((a) => !selectedIds.has(a.id));
  const limitReached = selectedAssets.length >= MAX_LINKED;

  const add = (asset) => {
    if (limitReached || selectedIds.has(asset.id)) return;
    onChange([...selectedAssets, asset]);
    setTerm("");
    setOpen(false);
  };

  const remove = (id) => onChange(selectedAssets.filter((a) => a.id !== id));

  return (
    <div ref={wrapRef}>
      <div className="relative">
        <input
          type="text"
          value={term}
          onChange={(e) => {
            setTerm(e.target.value);
            setOpen(true);
          }}
          onFocus={() => setOpen(true)}
          disabled={limitReached}
          placeholder={
            limitReached
              ? `Maximum of ${MAX_LINKED} reached`
              : "Search by asset name..."
          }
          className="form-control py-2 w-full"
        />

        {open && !limitReached && (
          <div className="absolute z-20 mt-1 w-full max-h-64 overflow-y-auto rounded-md border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 shadow-lg">
            {isFetching && (
              <div className="px-3 py-2 text-xs text-slate-500">Searching...</div>
            )}
            {!isFetching && results.length === 0 && (
              <div className="px-3 py-2 text-xs text-slate-500">
                No matching assets.
              </div>
            )}
            {results.map((asset) => (
              <button
                type="button"
                key={asset.id}
                onClick={() => add(asset)}
                className="flex w-full items-center gap-2 px-3 py-1.5 text-left hover:bg-slate-100 dark:hover:bg-slate-700"
              >
                <Thumb cover={asset.cover} size={28} />
                <span className="min-w-0 flex-1">
                  <span className="block truncate text-sm text-slate-800 dark:text-slate-100">
                    {asset.name}
                  </span>
                  <span className="block truncate text-[11px] text-slate-500">
                    {asset.sub_category?.name || ""}
                  </span>
                </span>
                <AccessBadge type={asset.access_type} />
              </button>
            ))}
          </div>
        )}
      </div>

      <div className="mt-3 max-h-48 overflow-y-auto space-y-1.5">
        {selectedAssets.length === 0 ? (
          <p className="text-xs text-slate-500">No assets attached yet.</p>
        ) : (
          selectedAssets.map((asset) => (
            <div
              key={asset.id}
              className="flex items-center gap-2 rounded border border-slate-200 dark:border-slate-700 px-2 py-1"
            >
              <Thumb cover={asset.cover} size={24} />
              <span className="min-w-0 flex-1 truncate text-sm text-slate-800 dark:text-slate-100">
                {asset.name}
                {asset.sub_category?.name && (
                  <span className="text-slate-500">
                    {" "}
                    • {asset.sub_category.name}
                  </span>
                )}
              </span>
              <button
                type="button"
                onClick={() => remove(asset.id)}
                aria-label={`Remove ${asset.name}`}
                className="shrink-0 px-1.5 text-lg leading-none text-slate-400 hover:text-red-500"
              >
                ×
              </button>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default LinkedAssetSelector;
