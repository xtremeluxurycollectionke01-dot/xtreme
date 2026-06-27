// // app/api/mpesa/stk/route.ts
// import { NextRequest, NextResponse } from 'next/server';
// import axios from 'axios';
// import dayjs from 'dayjs';
// import { getAccessToken } from '@/lib/mpesa/token';
// import { dbConnect } from '@/lib/mongodb';

// import { requireAuth } from '@/lib/auth';
// import Order from '@/models/Order';

// export async function POST(request: NextRequest) {
//   try {
//     await dbConnect();

//     // Get authenticated user
//     const user = await requireAuth(request);

//     if (!user) {
//       return NextResponse.json(
//         { success: false, error: 'Unauthorized - Please login' },
//         { status: 401 }
//       );
//     }

//     const { orderId, phoneNumber } = await request.json();

//     // Validate inputs
//     if (!orderId) {
//       return NextResponse.json(
//         { success: false, error: 'Order ID is required' },
//         { status: 400 }
//       );
//     }

//     if (!phoneNumber) {
//       return NextResponse.json(
//         { success: false, error: 'Phone number is required' },
//         { status: 400 }
//       );
//     }

//     // Find order and verify ownership
//     const order = await Order.findOne({
//       _id: orderId,
//       userId: user._id.toString(),
//     });

//     if (!order) {
//       return NextResponse.json(
//         { success: false, error: 'Order not found' },
//         { status: 404 }
//       );
//     }

//     // Check if order is already completed
//     if (order.status === 'COMPLETED') {
//       return NextResponse.json(
//         { success: false, error: 'Order already completed' },
//         { status: 400 }
//       );
//     }

//     const amount = order.totalAmount;

//     // Format phone number (remove leading + or 0)
//     let formattedPhone = phoneNumber.replace(/^\+/, '');
//     if (formattedPhone.startsWith('0')) {
//       formattedPhone = '254' + formattedPhone.substring(1);
//     }
//     if (!formattedPhone.startsWith('254')) {
//       formattedPhone = '254' + formattedPhone;
//     }

//     const token = await getAccessToken();
//     const timestamp = dayjs().format('YYYYMMDDHHmmss');

//     const password = Buffer.from(
//       `${process.env.MPESA_SHORTCODE}${process.env.MPESA_PASSKEY}${timestamp}`
//     ).toString('base64');

//     const payload = {
//       BusinessShortCode: process.env.MPESA_SHORTCODE,
//       Password: password,
//       Timestamp: timestamp,
//       TransactionType: 'CustomerPayBillOnline',
//       Amount: Math.ceil(amount),
//       PartyA: formattedPhone,
//       PartyB: process.env.MPESA_SHORTCODE,
//       PhoneNumber: formattedPhone,
//       CallBackURL: `${process.env.NEXT_PUBLIC_BASE_URL}/api/mpesa/callback`,
//       AccountReference: order.orderNumber,
//       TransactionDesc: `Payment for ${order.orderNumber}`,
//     };

//     console.log('📲 STK Push Payload:', payload);

//     const response = await axios.post(
//       'https://api.safaricom.co.ke/mpesa/stkpush/v1/processrequest',
//       payload,
//       {
//         headers: {
//           Authorization: `Bearer ${token}`,
//           'Content-Type': 'application/json',
//         },
//         timeout: 30000,
//       }
//     );

//     console.log('📲 STK Response:', response.data);

//     // Store payment metadata in order
//     if (response.data.ResponseCode === '0') {
//       order.paymentMetadata = {
//         ...order.paymentMetadata,
//         checkoutRequestID: response.data.CheckoutRequestID,
//         merchantRequestID: response.data.MerchantRequestID,
//         phoneNumber: formattedPhone,
//         amount: amount,
//       };

//       order.paymentMethod = 'MPESA';
//       await order.save();
//     }

//     return NextResponse.json(response.data);
//   } catch (error: any) {
//     console.error('❌ STK Push error:', error);

//     return NextResponse.json(
//       {
//         success: false,
//         error: error.message || 'Failed to initiate payment',
//         ResponseCode: '1',
//         ResponseDescription: error.message || 'Payment initiation failed',
//       },
//       { status: 500 }
//     );
//   }
// }

// app/api/mpesa/stk/route.ts
import { NextRequest, NextResponse } from 'next/server';
import axios from 'axios';
import dayjs from 'dayjs';
import { getAccessToken } from '@/lib/mpesa/token';
import { dbConnect } from '@/lib/mongodb';
import { requireAuth } from '@/lib/auth';
import Order from '@/models/Order';

export async function POST(request: NextRequest) {
  try {
    await dbConnect();

    // Try to get authenticated user (optional for guest orders)
    let user = null;
    try {
      user = await requireAuth(request);
    } catch (e) {
      // User not authenticated - guest checkout
      console.log('Guest checkout - no user auth');
    }

    const { orderId, phoneNumber } = await request.json();

    // Validate inputs
    if (!orderId) {
      return NextResponse.json(
        { success: false, error: 'Order ID is required' },
        { status: 400 }
      );
    }

    if (!phoneNumber) {
      return NextResponse.json(
        { success: false, error: 'Phone number is required' },
        { status: 400 }
      );
    }

    // Find order
    const order = await Order.findById(orderId);

    if (!order) {
      return NextResponse.json(
        { success: false, error: 'Order not found' },
        { status: 404 }
      );
    }

    // If user is authenticated, verify ownership
    if (user && order.user && order.user.toString() !== user._id.toString()) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized - Order belongs to another user' },
        { status: 401 }
      );
    }

    // Check if order can be paid
    if (order.paymentStatus === 'paid') {
      return NextResponse.json(
        { success: false, error: 'Order already paid' },
        { status: 400 }
      );
    }

    if (order.orderStatus === 'cancelled') {
      return NextResponse.json(
        { success: false, error: 'Order has been cancelled' },
        { status: 400 }
      );
    }

    const amount = Math.ceil(order.totalAmount);

    // Format phone number
    let formattedPhone = phoneNumber.replace(/^\+/, '');
    if (formattedPhone.startsWith('0')) {
      formattedPhone = '254' + formattedPhone.substring(1);
    }
    if (!formattedPhone.startsWith('254')) {
      formattedPhone = '254' + formattedPhone;
    }

    const token = await getAccessToken();
    const timestamp = dayjs().format('YYYYMMDDHHmmss');

    const password = Buffer.from(
      `${process.env.MPESA_SHORTCODE}${process.env.MPESA_PASSKEY}${timestamp}`
    ).toString('base64');

    const payload = {
      BusinessShortCode: process.env.MPESA_SHORTCODE,
      Password: password,
      Timestamp: timestamp,
      TransactionType: 'CustomerPayBillOnline',
      Amount: amount,
      PartyA: formattedPhone,
      PartyB: process.env.MPESA_SHORTCODE,
      PhoneNumber: formattedPhone,
      CallBackURL: `${process.env.NEXT_PUBLIC_BASE_URL}/api/mpesa/callback`,
      AccountReference: order.orderNumber,
      TransactionDesc: `Payment for ${order.orderNumber}`,
    };

    console.log('📲 STK Push Payload:', JSON.stringify(payload, null, 2));

    const response = await axios.post(
      'https://api.safaricom.co.ke/mpesa/stkpush/v1/processrequest',
      payload,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        timeout: 30000,
      }
    );

    console.log('📲 STK Response:', response.data);

    // Store payment metadata in order
    if (response.data.ResponseCode === '0') {
      order.paymentMetadata = {
        checkoutRequestID: response.data.CheckoutRequestID,
        merchantRequestID: response.data.MerchantRequestID,
        phoneNumber: formattedPhone,
        amount: amount,
      };
      order.paymentStatus = 'awaiting_confirmation';
      await order.save();

      return NextResponse.json({
        success: true,
        data: response.data,
        orderId: order._id,
        message: 'STK push sent successfully',
      });
    } else {
      return NextResponse.json({
        success: false,
        error: response.data.ResponseDescription || 'Failed to initiate payment',
        data: response.data,
      }, { status: 400 });
    }
  } catch (error: any) {
    console.error('❌ STK Push error:', error);

    return NextResponse.json(
      {
        success: false,
        error: error.message || 'Failed to initiate payment',
        ResponseCode: '1',
        ResponseDescription: error.message || 'Payment initiation failed',
      },
      { status: 500 }
    );
  }
}