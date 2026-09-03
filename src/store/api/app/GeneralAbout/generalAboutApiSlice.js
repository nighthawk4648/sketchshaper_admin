import { apiSlice } from '@/store/api/apiSlice';

export const generalAboutApiSlice = apiSlice.injectEndpoints({
    endpoints: (builder) => ({
        getGeneralAboutUs: builder.query({
            query: () => 'general/about-us',
            providesTags: ['general-about-us'],
        }),
       

        createGeneralAboutUs: builder.mutation({
            query: (data) => ({
                url: 'general/about-us',
                method: 'POST',
                body: data,
            }),
            invalidatesTags: ['general-about-us'],
        }),

       


      
    }),
});

export const {
    useCreateGeneralAboutUsMutation, 
    useGetGeneralAboutUsQuery
   

} = generalAboutApiSlice;
