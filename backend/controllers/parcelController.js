const db = require("./../config/dbConnection");
const cloudinary = require('cloudinary').v2;
const fs = require('fs').promises; 
const sendEmail=require("../utils/sendMail");


const generateTrackingNumber = () => {
    return 'TRK' + Math.floor(Math.random() * 1000000000);
}

// const parcelCreation = async (req, res) => {
//     try {
//         const {
//             senderName,
//             senderGender,
//             senderPhone,
//             senderNationality,
//             receiverName,
//             receiverPhone,
//             receiverGender,
//             receiverNationality,
//             receiverEmail,
//             origin,
//             weight,
//             destination,
//             destinationLatitude,
//             destinationLongitude,
//             service_type,
//             description,
//             parcelName,
//             deliveryDate,
//         } = req.body;

//         console.log('Request Body:', req.body);

//         // Generate tracking number
//         const trackingNumber = generateTrackingNumber(); 
//         const userId = req.user.id; // Assuming userId is obtained from req.user
//         let imageUrl = null;
//         let imagePublicId = null;

//         // Check if a file was uploaded
//         if (req.file) {
//           console.log("file image",req.file);
//             try {
//                 // Upload image to Cloudinary
//                 const uploadResponse = await cloudinary.uploader.upload(req.file.path, {
//                     folder: 'parcel_images'
//                 });
// console.log(uploadResponse);
//                 // Delete local file after upload
//                 await fs.unlink(req.file.path);
//                 imageUrl = uploadResponse.secure_url;
//                 imagePublicId = uploadResponse.public_id;
//             } catch (uploadError) {
//                 return res.status(500).json({ message: 'Error uploading image' });
//             }
//         }

//         // Insert parcel data into the database using Promise-based query
//         const query = `
//             INSERT INTO parcels (
//                 trackingNumber, userId, senderName, senderPhone, senderNationality, senderGender, 
//                 receiverName, receiverPhone, receiverEmail, receiverNationality, receiverGender, 
//                 origin, weight, destination, destinationLatitude, destinationLongitude, 
//                 service_type, description, parcelName, deliveryDate, imageUrl, imagePublicId
//             ) 
//             VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`;

//         const values = [
//             trackingNumber,
//             userId,
//             senderName,
//             senderPhone,
//             senderNationality,
//             senderGender,
//             receiverName,
//             receiverPhone,
//             receiverEmail,
//             receiverNationality,
//             receiverGender,
//             origin,
//             weight,
//             destination,
//             destinationLatitude,
//             destinationLongitude,
//             service_type,
//             description,
//             parcelName,
//             deliveryDate, 
//             imageUrl,
//             imagePublicId
//         ];

//         // Promisify the database query
//         await new Promise((resolve, reject) => {
//             db.query(query, values, (err, parcelResult) => {
//                 if (err) {
//                     reject(err);
//                 } else {
//                     resolve(parcelResult);
//                 }
//             });
//         });

//         const subject = 'Parcel Created Successfully!';
//         const text = `Dear Customer, your parcel with tracking number ${trackingNumber} has been created successfully.`;
//         const html = `
//           <p>Dear Customer,</p>
//           <p>Your parcel has been created successfully with the following details:</p>
//           <ul>
//             <li><strong>Tracking Number:</strong> ${trackingNumber}</li>
//             <li><strong>Sender Name:</strong> ${senderName}</li>
//             <li><strong>Receiver Name:</strong> ${receiverName}</li>
//             <li><a href="http://tunshpreshgloballtd.com">click here</li>
//           </ul>
//           <p style="color:'dark-gray'>Disclaimer: This email and any attachments are confidential and are intended solely for the addressee. If you are not the addressee tell the sender immediately and destroy it. Do not open, read, copy, disclose, use or store it in any way, or permit others to do so. Emails are not secure and may suffer errors, viruses, delay, interception, and amendment.Its subsidiaries do not accept liability for damage caused by this email and may monitor email traffic.</p>

//           <p style="color:'dark-gray'>Ce mail, y compris toute pièce jointe, est confidentiel. Il est exclusivement adressé aux destinataires désignés. Si vous le recevez par erreur, veuillez immédiatement aviser l'expéditeur et détruisez-le sans l'ouvrir ni le lire. Toute copie, diffusion, conservation, utilisation sous quelque forme que ce soit ou l'autorisation de toute personne à le faire est interdite. Le mail n'est pas un moyen sûr et peut contenir des erreurs ou des virus, comme il peut être retardé, intercepté ou modifié.  et ses filiales déclinent toute responsabilité pour des dommages causés par ce mail et se réservent le droit de contrôler la circulation des mails</P>
//         `;

//         await sendEmail(receiverEmail, subject, text, html);  // Send email after parcel creation

//         // Return the response with the parcel creation status
//         res.status(201).json({
//             message: 'Parcel created successfully',
//             trackingNumber,
//             imageUrl,
//             imagePublicId,
//             receiverGender, // Include receiverGender in the response for confirmation
//             receiverNationality // Include receiverNationality in the response for confirmation
//         });
//     } catch (err) {
//         console.error('Server error:', err);
//         return res.status(500).json({ message: 'Internal Server Error', error: err.message });
//     }
// };



const logActivity = require('../config/logActivity');

const parcelCreation = async (req, res) => {
  try {
    const {
      senderName, senderGender, senderPhone, senderNationality, senderEmail,
      receiverName, receiverPhone, receiverEmail, receiverNationality, receiverGender,
      origin, weight, destination, destinationLatitude, destinationLongitude,
      service_type, description, parcelName, dispatchDate, deliveryDate,
      freight_charge, insurance_fee, tax_due,
      originLatitude, originLongitude, currentLatitude, currentLongitude,
      quantity,
      descriptions,
      quantities
    } = req.body;

    const trackingNumber = generateTrackingNumber();
    const userId = req.user.id; 
    let imageUrl = null;
    let imagePublicId = null;
    const uploadedImages = [];
    
    // Normalize arrays
    const descArray = Array.isArray(descriptions) ? descriptions : [descriptions];
    const qtyArray = Array.isArray(quantities) ? quantities : [quantities];

    if (req.files && req.files.length > 0) {
      for (let i = 0; i < req.files.length; i++) {
        const file = req.files[i];
        try {
          const uploadResponse = await cloudinary.uploader.upload(file.path, { folder: 'parcel_images' });
          await fs.unlink(file.path);
          uploadedImages.push({
            url: uploadResponse.secure_url,
            publicId: uploadResponse.public_id,
            description: descArray[i] || '',
            quantity: parseInt(qtyArray[i]) || 1
          });
        } catch (uploadError) {
          console.error("Cloudinary Error:", uploadError);
        }
      }
      if (uploadedImages.length > 0) {
        imageUrl = uploadedImages[0].url;
        imagePublicId = uploadedImages[0].publicId;
      }
    }

    // Calculate total quantity from items if not provided
    const totalQuantity = uploadedImages.length > 0 
        ? uploadedImages.reduce((sum, item) => sum + item.quantity, 0)
        : (parseInt(quantity) || 1);

    const query = `
      INSERT INTO parcels (
        trackingNumber, userId, senderName, senderPhone, senderNationality, senderGender, senderEmail,
        receiverName, receiverPhone, receiverEmail, receiverNationality, receiverGender, 
        origin, weight, destination, originLatitude, originLongitude, currentLatitude, currentLongitude, 
        destinationLatitude, destinationLongitude, 
        service_type, description, parcelName, dispatchDate, deliveryDate, imageUrl, imagePublicId,
        freight_charge, insurance_fee, tax_due,
        quantity
      ) 
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;
    const values = [
      trackingNumber, userId, senderName, senderPhone, senderNationality, senderGender, senderEmail,
      receiverName, receiverPhone, receiverEmail, receiverNationality, receiverGender,
      origin, weight, destination, 
      originLatitude || 0, originLongitude || 0, currentLatitude || 0, currentLongitude || 0,
      destinationLatitude || 0, destinationLongitude || 0,
      service_type, description, parcelName, dispatchDate, deliveryDate, imageUrl, imagePublicId,
      freight_charge || 0, insurance_fee || 0, tax_due || 0,
      totalQuantity
    ];

    const [result] = await db.execute(query, values);
    const parcelId = result.insertId;

    // Batch insert additional images into parcel_images terminal
    if (uploadedImages.length > 0) {
      const imageQuery = "INSERT INTO parcel_images (parcel_id, imageUrl, imagePublicId, description, quantity) VALUES ?";
      const imageValues = uploadedImages.map(img => [parcelId, img.url, img.publicId, img.description, img.quantity]);
      await db.query(imageQuery, [imageValues]);
    }

    // High Standard: Log this action in the Activity Ledger
    await logActivity(userId, 'PARCEL_INITIALIZED', { trackingNumber, receiverName, freight_charge });

    const subject = 'Parcel Initialized & Dispatched - Tracking Activated';
    const text = `Dear ${receiverName}, your parcel with tracking number ${trackingNumber} has been created and inducted into our network.`;
    const html = `
      <div style="font-family: sans-serif;">
        <h3 style="color: #0f172a;">Consignment Induction Verified</h3>
        <p>Dear <strong>${receiverName}</strong>,</p>
        <p>This is to formally confirm that your consignment has been successfully inducted into the Tunshpresh Global operational ledger. Asset tracking and routing computations have commenced.</p>
        
        <div style="background-color: #f1f5f9; border: 1px solid #e2e8f0; padding: 16px; margin: 24px 0; border-radius: 8px;">
            <p style="margin: 0 0 8px; font-size: 12px; color: #64748b; text-transform: uppercase; font-weight: bold;">Electronic Tracking ID</p>
            <p style="margin: 0; font-size: 24px; font-weight: 900; color: #0f172a; font-family: monospace;">${trackingNumber}</p>
            <div style="margin-top: 16px; padding-top: 16px; border-top: 1px solid #cbd5e1; display: flex; justify-content: space-between;">
               <div><span style="font-size: 10px; color: #64748b; text-transform: uppercase;">Origin</span><br/><strong style="color: #0f172a;">${origin}</strong></div>
               <div style="text-align: right;"><span style="font-size: 10px; color: #64748b; text-transform: uppercase;">Destination</span><br/><strong style="color: #0f172a;">${destination}</strong></div>
            </div>
        </div>

        <div style="text-align: center; margin-top: 32px;">
            <a href="https://tunshpreshgloballtd.com/parcels/${trackingNumber}" 
               style="background-color: #0f172a; color: #ffffff; padding: 14px 28px; text-decoration: none; border-radius: 8px; font-weight: bold; display: inline-block;">
               Access Tracking Terminal
            </a>
        </div>
      </div>
    `;
    await sendEmail(receiverEmail, subject, text, html);

    return res.status(201).json({ message: 'Parcel created successfully', trackingNumber });
  } catch (err) {
    console.error('Server error:', err);
    return res.status(500).json({ message: 'Internal Server Error', error: err.message });
  }
};


const getAllParcel=async(req,res)=>{
   try{
    const [parcelResult] = await db.execute("SELECT *, (SELECT COUNT(*) FROM parcels) AS totalParcels FROM parcels");
        if(parcelResult.length === 0){
          return res.status(200).json({success:true,parcelResult:[],totalParcels:0});
        }
        const totalParcels=parcelResult[0].totalParcels
        res.status(200).json({success:true,parcelResult,totalParcels})
     }catch(error){
     res.status(500).json({success:false,message:`Internal server error, ${error.message}`});
   }
}

const getParcelDetail = async (req, res) => {
  try {
    const { trackingNumber } = req.params;
    console.log("tracking number parcel", trackingNumber);
    
    if (!trackingNumber) {
      return res.status(400).json({ success: false, message: 'Tracking number is required' });
    }

    const [results] = await db.execute("SELECT * FROM parcels WHERE trackingNumber=?", [trackingNumber]);
    
    if (results.length === 0) {
      return res.status(404).json({ success: false, message: `No parcel with such ${trackingNumber} found` });
    }

    const result = results[0];

    // Fetch all associated assets from the parcel_images terminal
    const [images] = await db.execute("SELECT imageUrl, description, quantity FROM parcel_images WHERE parcel_id = ?", [result.id]);
    result.images = images.map(img => ({
        url: img.imageUrl,
        description: img.description,
        quantity: img.quantity
    }));

    // 🗓️ Format dates for Frontend compatibility (e.g. from ISO/Date to YYYY-MM-DD)
    const formatDate = (dateValue) => {
        if (!dateValue || dateValue === '0000-00-00') return '';
        try {
            const d = new Date(dateValue);
            if (isNaN(d.getTime())) return '';
            return d.toISOString().split('T')[0];
        } catch (e) {
            return '';
        }
    };

    result.dispatchDate = formatDate(result.dispatchDate);
    result.deliveryDate = formatDate(result.deliveryDate);

    const [parcelHistory]=await db.execute("SELECT * FROM parcel_history WHERE trackingNumber=? ORDER BY updatedAt",[trackingNumber]);
    res.status(200).json({ success: true, result, parcelHistory });
  } catch (error) {
    res.status(500).json({ success: false, message: `Internal server error ${error.message}` });
  }
};





const updateParcelLocation = async (req, res) => {
  try {
    const { trackingNumber } = req.params;
    const { 
      currentLocation, 
      destinationLatitude, 
      destinationLongitude, 
      originLatitude,
      originLongitude,
      currentLatitude,
      currentLongitude,
      progressStatus, 
      status, 
      freight_charge, 
      insurance_fee, 
      tax_due, 
      payment_status, 
      hold_reason,
      release_fee,
      dispatchDate,
      deliveryDate,
      keepImages,
      quantity,
      description,
      updatedAt
    } = req.body;

    const trackingNumberString = trackingNumber.toString().trim();

    // Check if parcel exists
    const [parcelResults] = await db.execute(
      "SELECT * FROM parcels WHERE TRIM(trackingNumber) = ?",
      [trackingNumberString]
    );
    if (parcelResults.length === 0) {
      return res.status(404).json({ message: 'No parcel record found' });
    }
    const updatedParcel = parcelResults[0];
    const date = updatedAt ? new Date(updatedAt) : new Date();

    // 📍 COORD RECTIFICATION: Convert empty strings to null or fallback
    const dLat = destinationLatitude && destinationLatitude !== '' ? destinationLatitude : (updatedParcel.destinationLatitude || 0);
    const dLng = destinationLongitude && destinationLongitude !== '' ? destinationLongitude : (updatedParcel.destinationLongitude || 0);
    const oLat = originLatitude && originLatitude !== '' ? originLatitude : (updatedParcel.originLatitude || 0);
    const oLng = originLongitude && originLongitude !== '' ? originLongitude : (updatedParcel.originLongitude || 0);
    const cLat = currentLatitude && currentLatitude !== '' ? currentLatitude : (updatedParcel.currentLatitude || 0);
    const cLng = currentLongitude && currentLongitude !== '' ? currentLongitude : (updatedParcel.currentLongitude || 0);
    const cLoc = currentLocation || updatedParcel.currentLocation;
    const pStat = progressStatus !== undefined ? progressStatus : (updatedParcel.progressStatus || 0);
    const pStatus = status || updatedParcel.status;

    // Update main parcel record
    const updateQuery = `
      UPDATE parcels 
      SET currentLocation = ?, 
          destinationLongitude = ?, 
          destinationLatitude = ?, 
          originLatitude = ?,
          originLongitude = ?,
          currentLatitude = ?,
          currentLongitude = ?,
          progressStatus = ?, 
          status = ?, 
          freight_charge = ?, 
          insurance_fee = ?, 
          tax_due = ?, 
          payment_status = ?, 
          hold_reason = ?,
          release_fee = ?,
          dispatchDate = ?,
          deliveryDate = ?,
          description = ?,
          quantity = ?,
          updatedAt = ?
      WHERE trackingNumber = ?`;

    const queryParams = [
      cLoc, 
      dLng, 
      dLat, 
      oLat,
      oLng,
      cLat,
      cLng,
      pStat, 
      pStatus,
      freight_charge !== undefined ? freight_charge : updatedParcel.freight_charge,
      insurance_fee !== undefined ? insurance_fee : updatedParcel.insurance_fee,
      tax_due !== undefined ? tax_due : updatedParcel.tax_due,
      payment_status || updatedParcel.payment_status,
      hold_reason || updatedParcel.hold_reason,
      release_fee !== undefined ? release_fee : updatedParcel.release_fee,
      dispatchDate !== undefined ? dispatchDate : updatedParcel.dispatchDate,
      deliveryDate !== undefined ? deliveryDate : updatedParcel.deliveryDate,
      description !== undefined ? description : updatedParcel.description,
      quantity !== undefined ? quantity : updatedParcel.quantity,
      date,
      trackingNumberString
    ];

    // Update the parcel record in the database
    await db.execute(updateQuery, queryParams);

    // 🖼️ HANDLE ASSET MANIFEST UPDATES (IMAGES)
    let finalImages = [];
    if (keepImages) {
        // If keepImages is provided (as a JSON string or array), we prune the current set
        const imagesToKeep = Array.isArray(keepImages) ? keepImages : JSON.parse(keepImages);
        
        // Find images NOT in imagesToKeep to delete from Cloudinary
        const [currentImages] = await db.execute("SELECT id, imageUrl, imagePublicId FROM parcel_images WHERE parcel_id = ?", [updatedParcel.id]);
        
        for (const img of currentImages) {
            if (!imagesToKeep.includes(img.imageUrl)) {
                // Delete from Cloudinary if we have a publicId
                if (img.imagePublicId) {
                    try { await cloudinary.uploader.destroy(img.imagePublicId); } catch (e) { console.error("Cloudinary Delete Error:", e); }
                }
                // Delete from DB
                await db.execute("DELETE FROM parcel_images WHERE id = ?", [img.id]);
            }
        }
    }

    // Process New Uploads
    if (req.files && req.files.length > 0) {
        const newUploadedImages = [];
        for (const file of req.files) {
            try {
                const uploadResponse = await cloudinary.uploader.upload(file.path, { folder: 'parcel_images' });
                await fs.unlink(file.path);
                newUploadedImages.push({
                    url: uploadResponse.secure_url,
                    publicId: uploadResponse.public_id
                });
            } catch (err) { console.error("Update Upload Error:", err); }
        }

        if (newUploadedImages.length > 0) {
            const imageQuery = "INSERT INTO parcel_images (parcel_id, imageUrl, imagePublicId) VALUES ?";
            const imageValues = newUploadedImages.map(img => [updatedParcel.id, img.url, img.publicId]);
            await db.query(imageQuery, [imageValues]);
            
            // If the main parcel record has no imageUrl, set it to the first new one
            if (!updatedParcel.imageUrl) {
                await db.execute("UPDATE parcels SET imageUrl = ?, imagePublicId = ? WHERE id = ?", [newUploadedImages[0].url, newUploadedImages[0].publicId, updatedParcel.id]);
            }
        }
    }


    const historyQuery = `
      INSERT INTO parcel_history 
        (parcel_id, trackingNumber, currentLocation, destinationLongitude, destinationLatitude, progressStatus, status, updatedAt)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `;
    const historyParams = [
      updatedParcel.id,
      trackingNumberString,
      cLoc,
      dLng,
      dLat,
      pStat,
      pStatus,
      date
    ];
    await db.execute(historyQuery, historyParams);

    // 🚀 AUTOMATED TELEMETRY NOTIFICATION: Notify recipient of status transition
    if (updatedParcel.receiverEmail) {
        const emailSubject = `Shipment Update: ${trackingNumberString} - ${status || updatedParcel.status}`;
        const emailHtml = `
            <div style="margin-bottom: 25px;">
                <h3 style="color: #0f172a; margin-top: 0; text-transform: uppercase; letter-spacing: 1px;">Logistics Telemetry Report</h3>
                <p style="color: #64748b; font-size: 14px;">Your consignment status has been updated in our global logistics network.</p>
            </div>
            
            <div style="background-color: #f8fafc; border: 1px solid #e2e8f0; border-radius: 12px; padding: 25px; margin-bottom: 25px;">
                <table style="width: 100%; border-collapse: collapse;">
                    <tr>
                        <td style="padding: 10px 0; border-bottom: 1px solid #f1f5f9; color: #94a3b8; font-size: 10px; text-transform: uppercase; font-weight: 800;">Tracking Number</td>
                        <td style="padding: 10px 0; border-bottom: 1px solid #f1f5f9; color: #0f172a; font-family: monospace; font-weight: 900; text-align: right;">${trackingNumberString}</td>
                    </tr>
                    <tr>
                        <td style="padding: 10px 0; border-bottom: 1px solid #f1f5f9; color: #94a3b8; font-size: 10px; text-transform: uppercase; font-weight: 800;">Current Status</td>
                        <td style="padding: 10px 0; border-bottom: 1px solid #f1f5f9; color: #2563eb; font-weight: 900; text-align: right; text-transform: uppercase;">${status || updatedParcel.status}</td>
                    </tr>
                    <tr>
                        <td style="padding: 10px 0; border-bottom: 1px solid #f1f5f9; color: #94a3b8; font-size: 10px; text-transform: uppercase; font-weight: 800;">Geofence Localization</td>
                        <td style="padding: 10px 0; border-bottom: 1px solid #f1f5f9; color: #0f172a; font-weight: 800; text-align: right;">${currentLocation || updatedParcel.currentLocation}</td>
                    </tr>
                    <tr>
                        <td style="padding: 10px 0; color: #94a3b8; font-size: 10px; text-transform: uppercase; font-weight: 800;">Operational Load</td>
                        <td style="padding: 10px 0; color: #0f172a; font-weight: 800; text-align: right;">${progressStatus || updatedParcel.progressStatus}% Processed</td>
                    </tr>
                </table>
            </div>
            
            ${(status === 'impounded' || status === 'held') ? `
                <div style="background-color: #fff1f2; border: 1px solid #fecdd3; border-radius: 12px; padding: 20px; text-align: center;">
                    <p style="color: #be123c; font-weight: 900; font-size: 13px; margin: 0; text-transform: uppercase;">⚠️ Administrative Action Required</p>
                    <p style="color: #e11d48; font-size: 11px; margin-top: 5px;">This consignment requires VAT clearance or duty reconciliation before further transit.</p>
                </div>
            ` : ''}

            <div style="text-align: center; margin-top: 35px;">
                <a href="https://tunshpreshgloballtd.com/parcels/${trackingNumberString}" 
                   style="background-color: #0f172a; color: #ffffff; padding: 16px 32px; text-decoration: none; border-radius: 12px; font-weight: 900; display: inline-block; font-size: 12px; letter-spacing: 1px; text-transform: uppercase;">
                   Track Shipment Live
                </a>
            </div>
        `;

        await sendEmail(updatedParcel.receiverEmail, emailSubject, `Your shipment status is now: ${status || updatedParcel.status}`, emailHtml);
    }

    // 🚀 AUTOMATED FINANCIAL SETTLEMENT: Create receipt if release_fee is Manifested
    if (release_fee > 0) {
      try {
        const referenceId = Math.floor(Math.random() * 1000000000);
        const receiptQuery = `
          INSERT INTO receipts (
            fullName, email, referenceId, userId, payment_description, 
            payment_method, amount, total_payment, payment_date, currency
          ) 
          VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        `;
        const receiptValues = [
          updatedParcel.receiverName,
          updatedParcel.receiverEmail,
          referenceId,
          req.user.id,
          `Customs Release Settlement Fee - Tracking ID: ${trackingNumberString}`,
          'Electronic Terminal Payment',
          release_fee,
          release_fee,
          new Date(),
          'USD'
        ];
        await db.execute(receiptQuery, receiptValues);
        console.log(`✅ Financial Manifested: Receipt created for ${trackingNumberString}`);
      } catch (receiptError) {
        console.error('❌ Financial Fault: Automated receipt generation failed:', receiptError.message);
      }
    }

    // Prepare email notification content
    const updatedStatus = status || updatedParcel.status;
    let subject = `Parcel Status Update: ${trackingNumber}`;
    let statusBanner = '#f1f5f9';
    let statusColor = '#0f172a';
    
    if (updatedStatus?.toLowerCase() === 'impounded') {
      subject = `ACTION REQUIRED: Parcel Impounded - Tracking ID: ${trackingNumber}`;
      statusBanner = '#fef2f2';
      statusColor = '#ef4444';
    } else if (updatedStatus?.toLowerCase() === 'delivered') {
      subject = `SUCCESS: Parcel Delivered - Tracking ID: ${trackingNumber}`;
      statusBanner = '#f0fdf4';
      statusColor = '#22c55e';
    }

    const text = `Dear ${updatedParcel.receiverName}, your parcel's status has been updated to ${updatedStatus}. Current location: ${currentLocation || updatedParcel.currentLocation}.`;
    const updateTimestamp = new Date().toLocaleString('en-US', { 
      timeZone: 'UTC', 
      dateStyle: 'full', 
      timeStyle: 'long' 
    });

    const html = `
      <div style="font-family: 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; max-width: 600px; margin: auto; border: 1px solid #e2e8f0; border-radius: 16px; overflow: hidden; background-color: #ffffff; color: #0f172a;">
        <div style="background-color: #0f172a; padding: 32px; text-align: center;">
            <h1 style="color: #ffffff; margin: 0; font-size: 18px; text-transform: uppercase; letter-spacing: 0.3em; font-weight: 900;">Transit Notification</h1>
            <p style="color: #64748b; margin: 8px 0 0; font-size: 10px; font-weight: bold; text-transform: uppercase; letter-spacing: 0.2em;">Global Logistics Ledger Update</p>
        </div>

        <div style="padding: 40px;">
            <p style="font-size: 14px; line-height: 1.6;">Dear <strong>${updatedParcel.receiverName}</strong>,</p>
            <p style="font-size: 14px; line-height: 1.6; color: #475569;">The operational status of your consignment has been successfully updated in our global tracking network. Please find the verified movement details below:</p>
            
            <div style="background-color: ${statusBanner}; border-radius: 12px; padding: 24px; margin: 32px 0; border: 1px solid ${statusColor}20;">
                <table style="width: 100%; border-collapse: collapse;">
                    <tr>
                        <td style="padding-bottom: 20px;">
                            <p style="margin: 0; font-size: 9px; color: #64748b; text-transform: uppercase; font-weight: 900; letter-spacing: 0.1em;">Tracking Identification</p>
                            <p style="margin: 4px 0 0; font-family: monospace; font-size: 16px; font-weight: bold; color: #0f172a;">${trackingNumber}</p>
                        </td>
                        <td style="padding-bottom: 20px; text-align: right;">
                            <p style="margin: 0; font-size: 9px; color: #64748b; text-transform: uppercase; font-weight: 900; letter-spacing: 0.1em;">System Status</p>
                            <p style="margin: 4px 0 0; font-size: 14px; font-weight: 900; color: ${statusColor}; text-transform: uppercase;">${updatedStatus}</p>
                        </td>
                    </tr>
                    <tr>
                        <td style="padding-top: 20px; border-top: 1px solid #e2e8f0;">
                            <p style="margin: 0; font-size: 9px; color: #64748b; text-transform: uppercase; font-weight: 900; letter-spacing: 0.1em;">Current Node</p>
                            <p style="margin: 4px 0 0; font-size: 14px; font-weight: bold; color: #0f172a;">${currentLocation || updatedParcel.currentLocation}</p>
                        </td>
                        <td style="padding-top: 20px; border-top: 1px solid #e2e8f0; text-align: right;">
                            <p style="margin: 0; font-size: 9px; color: #64748b; text-transform: uppercase; font-weight: 900; letter-spacing: 0.1em;">Log Timestamp</p>
                            <p style="margin: 4px 0 0; font-size: 11px; font-weight: bold; color: #0f172a;">${updateTimestamp}</p>
                        </td>
                    </tr>
                </table>
            </div>

            <div style="background-color: #f8fafc; border-radius: 12px; padding: 20px; margin-bottom: 32px;">
                <div style="display: flex; justify-content: space-between; align-items: center;">
                    <div style="flex: 1;">
                        <p style="margin: 0; font-size: 8px; color: #94a3b8; text-transform: uppercase; font-weight: 900;">Origin Terminal</p>
                        <p style="margin: 2px 0 0; font-size: 12px; font-weight: bold; color: #475569;">${updatedParcel.origin}</p>
                    </div>
                    <div style="padding: 0 15px; color: #cbd5e1;">&rarr;</div>
                    <div style="flex: 1; text-align: right;">
                        <p style="margin: 0; font-size: 8px; color: #94a3b8; text-transform: uppercase; font-weight: 900;">Target Destination</p>
                        <p style="margin: 2px 0 0; font-size: 12px; font-weight: bold; color: #475569;">${updatedParcel.destination}</p>
                    </div>
                </div>
            </div>

            ${['impounded', 'sealed', 'insurance_held', 'security_audit'].includes(updatedStatus?.toLowerCase()) ? `
              <div style="background-color: #fef2f2; border: 1px solid #fee2e2; border-radius: 12px; padding: 20px; margin-bottom: 32px;">
                <p style="margin: 0; color: #ef4444; font-size: 13px; font-weight: bold; line-height: 1.5;">
                  <strong>REGULATORY NOTICE:</strong> Your consignment has been intercepted by Regional Customs Authority / Security Audit. 
                  ${release_fee > 0 ? `<br/><br/>A release settlement fee of <strong>$${release_fee} USD</strong> has been Manifested. Immediate action is required to resolve clearance and release cargo.` : 'Immediate action is required to resolve clearance fees and release cargo.'}
                </p>
              </div>
            ` : ''}

            <div style="text-align: center;">
                <a href="https://tunshpreshgloballtd.com/parcels/${trackingNumber}" 
                   style="background-color: #0f172a; color: #ffffff; padding: 18px 32px; text-decoration: none; border-radius: 12px; font-size: 12px; font-weight: 900; text-transform: uppercase; letter-spacing: 0.2em; display: inline-block; box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1);">
                   Access Tracking Terminal
                </a>
            </div>
        </div>

        <div style="background-color: #f8fafc; padding: 24px; text-align: center; border-top: 1px solid #e2e8f0;">
            <p style="margin: 0; font-size: 10px; color: #94a3b8; text-transform: uppercase; letter-spacing: 0.1em;">Institutional Authority: Tunshpresh Global Ltd.</p>
            <p style="margin: 4px 0 0; font-size: 9px; color: #cbd5e1;">© 2026 Secured Transit Infrastructure. All rights reserved.</p>
        </div>
      </div>
    `;

    // Send email notification (ensure sendEmail returns a promise)
    await sendEmail(updatedParcel.receiverEmail, subject, text, html);

    return res.status(200).json({
      message: 'Location successfully updated, history recorded, and notification email sent',
   
    });
  } catch (error) {
    console.error("Server error:", error.message);
    return res.status(500).json({ message: 'Internal Server Error', error: error.message });
  }
};



  




const deleteParcel=async(req,res)=>{
    try{
        const {trackingNumber}=req.params;
        if(!trackingNumber){
           return res.status(400).json({success:false,message:'Tracking number is missing'});
        }
        const [parcelResult]=await db.execute("DELETE FROM parcels WHERE trackingNumber=?",[trackingNumber]);
        if(parcelResult.affectedRows === 0){
           return res.status(404).json({success:false,message:'No record found'});
        }
        const record=parcelResult[0];
        res.status(200).json({success:true,message:'Parcel successfully deleted',record});
    } catch(error) {
       res.status(500).json({success:false,message:"Internal Server error"});
    }
}

const getActivityLogs = async (req, res) => {
  try {
    const query = `
      SELECT al.*, u.firstname, u.lastname, u.email 
      FROM activity_logs al
      JOIN users u ON al.userId = u.id
      ORDER BY al.timestamp DESC
      LIMIT 200
    `;
    const [logs] = await db.execute(query);
    res.status(200).json({ success: true, logs });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = {
  parcelCreation,
  getParcelDetail,
  updateParcelLocation,
  deleteParcel,
  getAllParcel,
  getActivityLogs
};
