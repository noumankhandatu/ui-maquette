import React, { useEffect } from "react";
import {

  Typography,

  Layout,

} from "antd";

import "moment/locale/fr"; // Import French locale
import VCard from "vcard-creator";
import { apiGet } from "../utils/axios"; // Adjusted to import apiGet only

const HandleVCFQR = () => {


  useEffect(() => {
    handleDownloadVCF();
  }, []);







  const handleDownloadVCF = async () => {
    var url = new URL(window.location.href);

    // Extract the 'id' parameter value
    var id = url.searchParams.get('id');
     id = parseInt(id, 10); // 10 specifies decimal numeral system

    // Log the 'id' value to console

    try {
        const response = await apiGet(`/singlecontact/${id}`);
        if (response.success && response.contacts) {
          var formattedContacts = response.contacts.map((contact) => {
            return {
              key: contact.id, // Ensure each row has a unique key
              firstName: contact.firstName,
              phoneNumber: contact.phoneNumber,
              emailAddress: contact.emailAddress,
              enterprise: contact.enterprise,
            };
          });
        } else {
          console.error("Failed to fetch contacts");
        }
      } catch (error) {
        console.error("Error fetching contacts:", error);
      }
console.log(formattedContacts);
      const record = formattedContacts.find(contact => contact.key === id);
      if (record) {
        let [firstname, ...lastname] = record.firstName.split(" ");
        const myVCard = new VCard();
        myVCard
          .addName(lastname.toString().replaceAll(",", ""), firstname, "", "", "")
          .addCompany(record.enterprise)
          .addEmail(record.emailAddress)
          .addPhoneNumber(record.phoneNumber, "PREF;WORK")
          .addPhoneNumber(record.phoneNumber ?? "", "WORK");

        const element = document.createElement("a");
        const file = new Blob([myVCard.toString()], { type: "text/vcard;charset=utf-8" });
        element.href = URL.createObjectURL(file);
        element.download = `${record.firstName}.vcf`;
        document.body.appendChild(element);
        element.click();
      } else {
        console.error("Contact with id not found");
      }


  };

  return (
    <Layout>
    
    </Layout>
  );
};

export default HandleVCFQR;
