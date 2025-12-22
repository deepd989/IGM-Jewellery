

import { FAQ, Policy } from '@/interfaces/faq.interface';
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';


export const profileApiService = createApi({
  reducerPath: 'profile',
  baseQuery: fetchBaseQuery({ baseUrl: '/' }),
  endpoints: (builder) => ({
    getFAQs: builder.query({
      queryFn: (category: string) => {
       
        const faqs: FAQ[] = [
          {
            id: '1',
            category: 'Payment',
            question: 'How can I cancel my order once i have already paid?',
            answer: 'You can edit or add new details below. You can review your order and proceed to canceling your order. Applicable on online orders. At Stores & TAH, it’s even better—15-Day Full Value Exchange with no balance retained!',
          },
          { id: '2', category: 'Payment', question: 'What payment methods do you accept?', answer: 'We accept all major credit cards, UPI, and Net Banking.' },
          { id: '3', category: 'Payment', question: 'Is Cash on Delivery available?', answer: 'Yes, for orders under ₹50,000.' },
        ];
        return { data: faqs };
      },
    }),

     getPrivacyPolicies: builder.query<Policy, string>({
      queryFn: (category) => ({
        data: {
          id: '1',
          category,
          content: 'You can edit or add new details below. You can review your order and proceed to canceling your order. Applicable on online orders. At Stores & TAH, it’s even better—15-Day Full Value Exchange with no balance retained!'
        }
      })
    }),
  }),
});

export const { useGetFAQsQuery , useGetPrivacyPoliciesQuery } = profileApiService;
