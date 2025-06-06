import React from 'react';
import { FaWhatsapp } from 'react-icons/fa';

function WhatsAppLink() {
  const phoneNumber = process.env.REACT_APP_WHATSAPP_PHONE_NUMBER;
  // console.log(phoneNumber);
  const message = 'Hello, I would like to chat!';

  const whatsappUrl = `https://api.whatsapp.com/send?phone=${phoneNumber}&text=${encodeURIComponent(message)}`;

  return (
    <a href={whatsappUrl} className="fixed bottom-5 right-5 bg-green-500 text-white p-3 rounded-full shadow-lg z-50 hover:bg-green-600" target="_blank" rel="noopener noreferrer">
      <FaWhatsapp size={24} />
    </a>
  );
}

export default WhatsAppLink;
