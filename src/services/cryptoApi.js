import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

const cryptoApiHeaders = {
    'X-RapidAPI-Host': 'coinranking1.p.rapidapi.com',
    'X-RapidAPI-Key': '3ba1e33c89msh71db40d6458b9cap1f828bjsn65fe0af4f2b6',

}
const baseUrl = 'https://coinranking1.p.rapidapi.com';

const createRequest = (url)=>({url,headers:cryptoApiHeaders});

export const cryptoApi = createApi({
    reducerPath: 'cryptoApi',
    baseQuery: fetchBaseQuery({baseUrl}),
    endpoints:(builder)=>({
        getCryptos:builder.query({
            query:(count)=>createRequest(`/coins?limit=${count}`)
        }),
        getCryptoDetails:builder.query({
            query:(coinId)=>createRequest(`/coin/${coinId}`)
        }),
        getCryptoHistory:builder.query({
            query:({coinId, timePeriod})=>createRequest(`/coin/${coinId}/history?timePeriod=${timePeriod}`),
        })
    })
});
export const { useGetCryptosQuery,useGetCryptoDetailsQuery,useGetCryptoHistoryQuery} = cryptoApi;
