

import { FAQ, Policy } from '@/interfaces/faq.interface';
import { Order } from '@/interfaces/order-details.interface';
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
        getOrders: builder.query<Order[], void>({
      queryFn: () => ({
        data: [
          {
            id: 'ord1',
            displayId: '#12345667',
            orderDate: 'Sun, 3 Nov',
            totalAmount: 20000,
            itemCount: 3,
            statusSummary: '2 Items In Progress | 1 item delivered',
            items: [
              { id: 'si1', status: 'Dispatched', statusDate: 'Mon, 2 Nov', price: 3000, product: { title: 'Diamond Ring 24K, Kal...', brand: 'Kalyan Jewellers' as any } },
              { id: 'si2', status: 'Out for delivery', statusDate: 'Mon, 2 Nov', price: 5000, product: { title: 'Long Necklace 12k, Kal...', brand: 'Kalyan Jewellers' as any } },
              { id: 'si3', status: 'Delivered', statusDate: 'Mon, 2 Nov', price: 5000, product: { title: 'Diamond Ring 24K, Kal...', brand: 'Kalyan Jewellers' as any } },
            ]
          },
          {
            id: 'ord2',
            displayId: '#12345668',
            orderDate: 'Sun, 3 Nov',
            totalAmount: 20000,
            itemCount: 3,
            statusSummary: 'Order Delivered',
            items: [
              { id: 'si4', status: 'Delivered', statusDate: 'Mon, 2 Nov', price: 3000, product: { title: 'Diamond Ring 24K, Kal...', brand: 'Kalyan Jewellers' as any } },
              { id: 'si5', status: 'Delivered', statusDate: 'Mon, 2 Nov', price: 3000, product: { title: 'Diamond Ring 24K, Kal...', brand: 'Kalyan Jewellers' as any } },
              { id: 'si6', status: 'Delivered', statusDate: 'Mon, 2 Nov', price: 3000, product: { title: 'Diamond Ring 24K, Kal...', brand: 'Kalyan Jewellers' as any } },
            ]
          }
        ]
      })
    }),

        getOrderById: builder.query<Order, string>({
      queryFn: (id) => ({
        data: {
          id,
          displayId: '#12345667',
          orderDate: 'Sun, 3 Nov',
          totalAmount: 20000,
          itemCount: 1,
          statusSummary: 'Order Dispatched',
          pointsEarned: 670,
          paymentMethod: 'Paid by UPI',
          deliveryAddress: {
            name: 'User Name',
            line1: '144, Avon Classic, Suren Road, Andheri East,',
            line2: 'Mumbai 400 010',
            phone: '+91 9870951999'
          },
          items: [
            { id: 'si1', status: 'Dispatched', statusDate: 'Sun, 20 April 2025', price: 20000, product: { title: '24K Gold Ring', brand: 'Kalyan Jewellers' as any, description: '14 KT, Yellow Gold, 0.01 gm, Gem stone-Emerald, FG, Size 14, Length 16' } },
          ]
        }
      })
    })
  }),
});

export const { useGetFAQsQuery , useGetPrivacyPoliciesQuery ,useGetOrdersQuery, useGetOrderByIdQuery } = profileApiService;
