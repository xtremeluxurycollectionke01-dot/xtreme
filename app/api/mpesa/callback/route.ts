// // app/api/mpesa/callback/route.ts
// import { NextResponse } from 'next/server';
// import { dbConnect } from '@/lib/mongodb';
// import Order from '@/models/Order';

// export async function POST(req: Request) {
//   try {
//     await dbConnect();

//     const data = await req.json();
//     const result = data?.Body?.stkCallback;

//     console.log('🔁 M-Pesa Callback Received:', JSON.stringify(result, null, 2));

//     if (!result) {
//       console.error('❌ Invalid callback data structure');
//       return NextResponse.json({
//         ResultCode: 1,
//         ResultDesc: 'Invalid callback data',
//       });
//     }

//     const {
//       MerchantRequestID,
//       CheckoutRequestID,
//       ResultCode,
//       ResultDesc,
//       CallbackMetadata,
//     } = result;

//     // Find order by payment metadata
//     let order = await Order.findOne({
//       'paymentMetadata.checkoutRequestID': CheckoutRequestID,
//     });

//     if (!order) {
//       order = await Order.findOne({
//         'paymentMetadata.merchantRequestID': MerchantRequestID,
//       });
//     }

//     if (!order) {
//       console.error(`❌ No order found for transaction: ${CheckoutRequestID}`);
//       return NextResponse.json({
//         ResultCode: 1,
//         ResultDesc: 'Order not found',
//       });
//     }

//     console.log(`📋 Found order: ${order.orderNumber}`, {
//       currentStatus: order.status,
//     });

//     // Process successful payment
//     if (ResultCode === 0) {
//       console.log(`✅ Payment successful for ${order.orderNumber}`);

//       const items = CallbackMetadata?.Item || [];

//       const mpesaReceiptNumber = items.find(
//         (i: any) => i.Name === 'MpesaReceiptNumber'
//       )?.Value;

//       const transactionDate = items.find(
//         (i: any) => i.Name === 'TransactionDate'
//       )?.Value;

//       const phoneNumber = items.find(
//         (i: any) => i.Name === 'PhoneNumber'
//       )?.Value;

//       const amount = items.find(
//         (i: any) => i.Name === 'Amount'
//       )?.Value;

//       console.log(`📝 Extracted receipt number: ${mpesaReceiptNumber}`);

//       // Update order record
//       await order.markAsCompleted(mpesaReceiptNumber || CheckoutRequestID, {
//         resultCode: ResultCode,
//         resultDesc: ResultDesc,
//         transactionDate: transactionDate?.toString(),
//         phoneNumber,
//         mpesaReceiptNumber,
//         checkoutRequestID: CheckoutRequestID,
//         merchantRequestID: MerchantRequestID,
//         amount,
//       });

//       console.log(`💾 Order updated: ${order.orderNumber}`, {
//         receipt: mpesaReceiptNumber,
//         status: order.status,
//       });
//     } else {
//       // Payment failed
//       console.error(`❌ Payment failed for ${order.orderNumber}: ${ResultDesc}`);

//       await order.markAsFailed(ResultCode.toString(), ResultDesc);

//       console.log(`💾 Failed order recorded: ${order.orderNumber}`, {
//         errorCode: ResultCode,
//         errorMessage: ResultDesc,
//       });
//     }

//     // Always return success to Safaricom
//     return NextResponse.json({
//       ResultCode: 0,
//       ResultDesc: 'Success',
//     });
//   } catch (error: any) {
//     console.error('❌ Callback processing error:', error);

//     return NextResponse.json({
//       ResultCode: 1,
//       ResultDesc: error.message,
//     });
//   }
// }


// app/api/mpesa/callback/route.ts
import { NextResponse } from 'next/server';
import { dbConnect } from '@/lib/mongodb';
import Order from '@/models/Order';

export async function POST(req: Request) {
  try {
    await dbConnect();

    const data = await req.json();
    const result = data?.Body?.stkCallback;

    console.log('🔁 M-Pesa Callback Received:', JSON.stringify(result, null, 2));

    if (!result) {
      console.error('❌ Invalid callback data structure');
      return NextResponse.json({
        ResultCode: 1,
        ResultDesc: 'Invalid callback data',
      });
    }

    const {
      MerchantRequestID,
      CheckoutRequestID,
      ResultCode,
      ResultDesc,
      CallbackMetadata,
    } = result;

    // Find order by payment metadata
    let order = await Order.findOne({
      'paymentMetadata.checkoutRequestID': CheckoutRequestID,
    });

    if (!order) {
      order = await Order.findOne({
        'paymentMetadata.merchantRequestID': MerchantRequestID,
      });
    }

    if (!order) {
      console.error(`❌ No order found for transaction: ${CheckoutRequestID}`);
      return NextResponse.json({
        ResultCode: 1,
        ResultDesc: 'Order not found',
      });
    }

    console.log(`📋 Found order: ${order.orderNumber}`, {
      currentStatus: order.paymentStatus,
    });

    // Process successful payment
    if (ResultCode === 0) {
      console.log(`✅ Payment successful for ${order.orderNumber}`);

      const items = CallbackMetadata?.Item || [];

      const mpesaReceiptNumber = items.find(
        (i: any) => i.Name === 'MpesaReceiptNumber'
      )?.Value;

      const transactionDate = items.find(
        (i: any) => i.Name === 'TransactionDate'
      )?.Value;

      const phoneNumber = items.find(
        (i: any) => i.Name === 'PhoneNumber'
      )?.Value;

      const amount = items.find(
        (i: any) => i.Name === 'Amount'
      )?.Value;

      console.log(`📝 Extracted receipt number: ${mpesaReceiptNumber}`);

      // Update order - mark as paid
      order.paymentStatus = 'paid';
      order.mpesaDetails = {
        phoneNumber: phoneNumber || order.contactInfo.phone,
        transactionCode: mpesaReceiptNumber || CheckoutRequestID,
        amount: amount || order.totalAmount,
        paidAt: new Date(),
      };
      
      // Update order status to processing
      order.orderStatus = 'processing';
      
      await order.save();

      console.log(`💾 Order updated: ${order.orderNumber}`, {
        receipt: mpesaReceiptNumber,
        status: order.orderStatus,
        paymentStatus: order.paymentStatus,
      });
    } else {
      // Payment failed
      console.error(`❌ Payment failed for ${order.orderNumber}: ${ResultDesc}`);

      order.paymentStatus = 'failed';
      await order.save();

      console.log(`💾 Failed order recorded: ${order.orderNumber}`, {
        errorCode: ResultCode,
        errorMessage: ResultDesc,
      });
    }

    // Always return success to Safaricom
    return NextResponse.json({
      ResultCode: 0,
      ResultDesc: 'Success',
    });
  } catch (error: any) {
    console.error('❌ Callback processing error:', error);

    return NextResponse.json({
      ResultCode: 1,
      ResultDesc: error.message,
    });
  }
}