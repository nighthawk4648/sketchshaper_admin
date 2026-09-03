export const getIntegerWisedStatusPlainText = (status, delivery_type, payment_type) => {
    let statusName = '';

    if (status === 1) {
        statusName = 'Pickup Request';
    } else if (status === 2) {
        statusName = 'Parcel Hold';
    } else if (status === 3) {
        statusName = 'Deleted';
    } else if (status === 4) {
        statusName = 'Re-schedule Pickup';
    } else if (status === 5) {
        statusName = 'Assign for Pickup';
    } else if (status === 6) {
        statusName = 'Rider Assign For Pick';
    } else if (status === 7) {
        statusName = 'Pickup Run Cancel';
    } else if (status === 8) {
        statusName = 'On the way to Pickup';
    } else if (status === 9) {
        statusName = 'Pickup Rider Reject';
    } else if (status === 10) {
        statusName = 'Rider Picked';
    } else if (status === 11) {
        statusName = 'Picked Up';
    } else if (status === 12) {
        statusName = 'On the Way To Delivery Hub';
    } else if (status === 13) {
        statusName = 'Branch Transfer Cancel';
    } else if (status === 14) {
        statusName = 'At Delivery Hub';
    } else if (status === 15) {
        statusName = 'Delivery Branch Reject';
    } else if (status === 16) {
        statusName = 'Assign For Delivery';
    } else if (status === 17) {
        statusName = 'Out For Delivery';
    } else if (status === 18) {
        statusName = 'Delivery Run Cancel';
    } else if (status === 19) {
        statusName = 'On The Way To Delivery';
    } else if (status === 20) {
        statusName = 'Delivery Rider Reject';
    } else if (status === 21) {
        statusName = 'Rider Delivered';
    } else if (status === 22) {
        statusName = 'Partially Delivered';
    } else if (status === 23) {
        statusName = 'Rescheduled';
    } else if (status === 24) {
        statusName = 'Rider Return';
    } else if (status === 25 && delivery_type === 1) {
        statusName = 'Delivered';
    } else if (status === 25 && delivery_type === 2) {
        statusName = 'Partial Delivered';
    } else if (status === 25 && delivery_type === 3) {
        statusName = 'Rescheduled';
    } else if (status === 25 && delivery_type === 4) {
        statusName = 'Cancelled';
    } else if (status === 26 && delivery_type === 2) {
        statusName = 'Partial Delivered Branch Transfer';
    } else if (status === 27 && delivery_type === 2) {
        statusName = 'Partial Delivered & Branch Transfer Cancel';
    } else if (status === 28 && delivery_type === 2) {
        statusName = 'Partial Delivered & Branch Transfer Complete';
    } else if (status === 29 && delivery_type === 2) {
        statusName = 'Partial Delivered & Branch Transfer Complete';
    } else if (status === 30 && delivery_type === 2) {
        statusName = 'Partial Delivered & Return Run Create';
    } else if (status === 31 && delivery_type === 2) {
        statusName = 'Partial Delivered Branch & Return Run start';
    } else if (status === 32 && delivery_type === 2) {
        statusName = 'Partial Delivered Branch & Return Run Cancel';
    } else if (status === 33 && delivery_type === 2) {
        statusName = 'Partial Delivered & Return Rider Accept';
    } else if (status === 34 && delivery_type === 2) {
        statusName = 'Partial Delivered & Return Rider Reject';
    } else if (status === 35 && delivery_type === 2) {
        statusName = 'Partial Delivered & Rider Returned';
    } else if (status === 36 && delivery_type === 2) {
        statusName = 'Partial Delivered  & Returned';
    } else if (status === 26 && delivery_type === 4) {
        statusName = 'Return Transfer';
    } else if (status === 27 && delivery_type === 4) {
        statusName = 'Return Transfer Cancel';
    } else if (status === 28 && delivery_type === 4) {
        statusName = 'Return Transfer Complete';
    } else if (status === 29 && delivery_type === 4) {
        statusName = 'Return Transfer Reject';
    } else if (status === 30 && delivery_type === 4) {
        statusName = 'Return Run Create';
    } else if (status === 31 && delivery_type === 4) {
        statusName = 'Return Run start';
    } else if (status === 32 && delivery_type === 4) {
        statusName = 'Return Run Cancel';
    } else if (status === 33 && delivery_type === 4) {
        statusName = 'Return Run Rider Accept';
    } else if (status === 34 && delivery_type === 4) {
        statusName = 'Return Run Rider Reject';
    } else if (status === 35 && delivery_type === 4) {
        statusName = 'Return Run Complete';
    } else if (status === 36 && delivery_type === 4) {
        statusName = 'Return Complete';
    } else if (delivery_type === 1 && status === 25 && payment_type === 1) {
        statusName = 'Branch Payment Request';
    } else if (delivery_type === 1 && status === 25 && payment_type === 2) {
        statusName = 'Accounts Accept Payment';
    } else if (delivery_type === 1 && status === 25 && payment_type === 3) {
        statusName = 'Accounts Reject Payment';
    } else if (delivery_type === 1 && status === 25 && payment_type === 4) {
        statusName = 'Accounts Payment Request';
    } else if (delivery_type === 1 && status === 25 && payment_type === 5) {
        statusName = 'Paid';
    } else if (delivery_type === 1 && status === 25 && payment_type === 6) {
        statusName = 'Merchant Payment Reject';
    } else if (delivery_type === 2 && status === 25 && payment_type === 1) {
        statusName = 'Branch Delivery Exchange Payment Request';
    } else if (delivery_type === 2 && status === 25 && payment_type === 2) {
        statusName = 'Accounts Delivery Exchange Accept Payment';
    } else if (delivery_type === 2 && status === 25 && payment_type === 3) {
        statusName = 'Accounts Delivery Exchange Reject Payment';
    } else if (delivery_type === 2 && status === 25 && payment_type === 4) {
        statusName = 'Accounts Delivery Exchange Payment Request';
    } else if (delivery_type === 2 && status === 25 && payment_type === 5) {
        statusName = 'Accounts Delivery Exchange Payment Done';
    } else if (delivery_type === 2 && status === 25 && payment_type === 6) {
        statusName = 'Merchant Delivery Exchange Payment Reject';
    }

    return statusName;
};
