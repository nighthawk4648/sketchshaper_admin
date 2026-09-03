import { apiSlice } from '@/store/api/apiSlice';

export const applicationSettingsApiSlice = apiSlice.injectEndpoints({
    endpoints: (builder) => ({
        getApplicationSettings: builder.query({
            query: () => 'general/application-settings',
            providesTags: ['application-settings'],
        }),


        createApplicationSettings: builder.mutation({
            query: (data) => ({
                url: 'general/application-settings',
                method: 'POST',
                body: data,
            }),
            invalidatesTags: ['application-settings'],
        }),





    }),
});

export const {
    useCreateApplicationSettingsMutation,
    useGetApplicationSettingsQuery

} = applicationSettingsApiSlice;
