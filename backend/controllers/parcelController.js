const db = require("./../config/dbConnection");
const cloudinary = require('cloudinary').v2;
const fs = require('fs').promises; // Use promises for file operations

const generateTrackingNumber = () => {
    return 'TRK' + Math.floor(Math.random() * 1000000000);
}


const parcelCreation = async (req, res) => {
    try {
        const {
            senderName,
            senderGender,
            senderPhone,
            senderNationality,
            receiverName,
            receiverPhone,
            receiverGender,
            receiverNationality,
            receiverEmail,
            origin,
            weight,
            destination,
            destinationLatitude,
            destinationLongitude,
            service_type,
            description,
            parcelName,
            deliveryDate,
        } = req.body;

        const trackingNumber = generateTrackingNumber(); // Ensure this function is defined
        const userId = req.user.id; // Assuming userId is obtained from req.user
        let imageUrl = null;
        let imagePublicId = null;

        // Check if a file was uploaded
        if (req.file) {
            try {
                // Upload image to Cloudinary
                const uploadResponse = await cloudinary.uploader.upload(req.file.path, {
                    folder: 'parcel_images'
                });
                
                // Delete local file after upload
                await fs.unlink(req.file.path);
                imageUrl = uploadResponse.secure_url;
                imagePublicId = uploadResponse.public_id;
            } catch (uploadError) {
                return res.status(500).json({ message: 'Error uploading image' });
            }
        }

        // Insert parcel data into the database
        const query = `
            INSERT INTO parcels (
                trackingNumber, userId, senderName, senderPhone, senderNationality, senderGender, 
                receiverName, receiverPhone, receiverEmail, receiverNationality, receiverGender, 
                origin, weight, destination, destinationLatitude, destinationLongitude, 
                service_type, description, parcelName, deliveryDate, imageUrl, imagePublicId
            ) 
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?,?,?)`;

        // Ensure the number of values matches the number of columns in the INSERT statement
        db.query(query, [
            trackingNumber,
            userId,
            senderName,
            senderPhone,
            senderNationality,
            senderGender,
            receiverName,
            receiverPhone,
            receiverEmail,
            receiverNationality,
            receiverGender,
            origin,
            weight,
            destination,
            destinationLatitude,
            destinationLongitude,
            service_type,
            description,
            parcelName,
            deliveryDate, // Notice that status is omitted, it defaults to 'in transit'
            imageUrl,
            imagePublicId
        ], (err, parcelResult) => {
            if (err) {
                console.error('Database query error:', err);
                // If there's an error, delete the uploaded image from Cloudinary
                if (imagePublicId) {
                    cloudinary.uploader.destroy(imagePublicId, (destroyErr) => {
                        if (destroyErr) {
                            console.error('Cloudinary delete error:', destroyErr);
                        }
                    });
                }
                return res.status(500).json({ message: 'Error processing request', error: err.message });
            }
            

            res.status(201).json({ message: 'Parcel created successfully', trackingNumber, imageUrl, imagePublicId });
        });

    } catch (err) {
        console.error('Server error:', err);
        return res.status(500).json({ message: 'Internal Server Error', error: err.message });
    }
};






const getAllParcel=async(req,res)=>{
    const query=`SELECT * ,(SELECT COUNT(*) FROM parcels) AS totalParcels FROM parcels;`;
    db.query(query,(err,results)=>{
        if(err){
            return res.status(500).json({message:'Something Went Wrong'});
        }
        if(results.length === 0){
            return res.status(404).json({message:'No record found'});
        }
        const totalParcels=results[0].totalParcels;
        console.log(totalParcels);
        res.status(200).json({results,totalParcels});
    })
}

const getParcelDetail=async(req,res)=>{
    const {trackingNumber}=req.params;
    db.query("SELECT * FROM parcels WHERE trackingNumber=?",[trackingNumber],(err,results)=>{
        if(err){
            return res.status(500).json({message:'Something went wrong while processing your request'});
        }

        if(results.length === 0){
            return res.status(404).json({message:'No parcel found'})
        }
        const result=results[0];
        res.status(200).json({result});
    })
}



// const updateParcelLocation = async (req, res) => {
//     const { trackingNumber } = req.params;
//     const { currentLocation, destinationLatitude, destinationLongitude, progressStatus, status, updatedAt } = req.body;

//     try {
//         // Ensure all required fields are provided
//         if (!currentLocation || destinationLatitude === undefined || destinationLongitude === undefined || progressStatus === undefined || updatedAt === undefined || !status) {
//             return res.status(400).json({ message: "All fields are required" });
//         }

//         const date = new Date();
//         const trackingNumberString = trackingNumber.toString().trim(); // Trim spaces from tracking number

//         // Debugging logs
//         console.log("Tracking Number:", trackingNumberString);

//         // Check if the parcel exists before updating
//         db.query(
//             "SELECT * FROM parcels WHERE TRIM(trackingNumber) = ?",
//             [trackingNumberString],
//             (err, results) => {
//                 if (err) {
//                     console.error("SQL Error: ", err.sqlMessage);
//                     return res.status(500).json({ message: "Error checking parcel existence" });
//                 }

//                 if (results.length === 0) {
//                     return res.status(404).json({ message: 'No parcel found with the provided tracking number' });
//                 }

//                 // Prepare the update query
//                 let updateQuery;
//                 let queryParams;

//                 if (progressStatus === 100) {
//                     // If progressStatus is 100, update the status to 'delivered'
//                     updateQuery = `
//                         UPDATE parcels 
//                         SET currentLocation=?, destinationLatitude=?, destinationLongitude=?, status='delivered', progressStatus=?, updatedAt=? 
//                         WHERE trackingNumber=?`;
//                     queryParams = [currentLocation, destinationLatitude, destinationLongitude, progressStatus, date, trackingNumberString];
//                 } else {
//                     // If progressStatus is not 100, update the location, progress status, and set status to either 'impounded' or 'in transit'
//                     updateQuery = `
//                         UPDATE parcels 
//                         SET currentLocation=?, destinationLatitude=?, destinationLongitude=?, status=?, progressStatus=?, updatedAt=? 
//                         WHERE trackingNumber=?`;
//                     queryParams = [currentLocation, destinationLatitude, destinationLongitude, status, progressStatus, date, trackingNumberString];
//                 }

//                 console.log("Executing Update SQL:", updateQuery, queryParams);

//                 db.query(
//                     updateQuery,
//                     queryParams,
//                     (err, updateResults) => {
//                         if (err) {
//                             console.error("SQL Error: ", err.sqlMessage);
//                             return res.status(500).json({ message: "Error occurred while updating the parcel location" });
//                         }

//                         res.status(200).json({ message: 'Parcel location updated successfully', updateResults });
//                     }
//                 );
//             }
//         );
//     } catch (error) {
//         console.error("Server Error: ", error);
//         res.status(500).json({ message: 'Server error' });
//     }
// };

// const updateParcelLocation=async(req,res)=>{
//     const {trackingNumber}=req.params;
//     const {currentLocation,destinationLatitude,destinationLongitude,progressStatus,status,updatedAt}=req.body;

//     try{
//         if(!currentLocation || destinationLatitude === undefined || destinationLongitude === undefined || progressStatus === undefined || updatedAt === undefined || !status){
//             res.status(400).json({message:'Please provide all required field'});
//         }

//         const date=new Date();
//         const trackingNumberString=trackingNumber.toString().trim();
    


//         db.query("SELECT * FROM parcels WHERE TRIM(trackingNumber)=?",[trackingNumberString],(err,results)=>{
//             if(err){
//                 res.status(400).json({message:'Error occurred while checking existing parcel'});
//             }
//             if(results.length === 0){
//                 res.status(404).json({message:'No parcel record found'});
//             }

//              let queryParams;
//              let updateQuery;

//              if(progressStatus === 100){
//                 updateQuery=`
//                 UPDATE parcels 
//                 SET currentLocation=?,destinationLongitude=?,destinationLatitude=?,progressStatus=?,status='delivered', updatedAt=?
//                 WHERE trackingNumber=? `;

//                 queryParams=[currentLocation,destinationLongitude,destinationLatitude,progressStatus,status,date,trackingNumberString];
//              }else{
//                 updateQuery=`
//                 UPDATE parcels
//                 SET currentLocation=?,destinationLongitude=?,destinationLatitude=?,progressStatus=?,status=?, updatedAt=?
//                 WHERE trackingNumber=?`;
//                 queryParams=[currentLocation,destinationLongitude,destinationLatitude,progressStatus,status,date,trackingNumberString];

//              }
//              db.query(updateQuery,queryParams,(err,updateResult)=>{
//                 if(err){
//                     res.status(500).json({message:'Error occurred while processing the location update request'});
//                 }
//                 io.emit('parcelUpdated', updatedParcel);
//                 res.status(200).json({message:'Location successfully update',updateResult});
//              })
//         })
//     }catch(error){
//         console.log("Server error" + error.message);
//         res.status(500).json({ message: 'Server error' });
//     }
// }


const updateParcelLocation = async (req, res) => {
    const { trackingNumber } = req.params;
    const { currentLocation, destinationLatitude, destinationLongitude, progressStatus, status, updatedAt } = req.body;
  
    try {
      // Validate required fields
      if (!currentLocation || destinationLatitude === undefined || destinationLongitude === undefined || progressStatus === undefined || updatedAt === undefined || !status) {
        return res.status(400).json({ message: 'Please provide all required fields' });
      }
  
      const date = new Date();
      const trackingNumberString = trackingNumber.toString().trim();
  
      // Check if parcel exists
      db.query("SELECT * FROM parcels WHERE TRIM(trackingNumber) = ?", [trackingNumberString], (err, results) => {
        if (err) {
          return res.status(500).json({ message: 'Error occurred while checking existing parcel' });
        }
        if (results.length === 0) {
          return res.status(404).json({ message: 'No parcel record found' });
        }
  
        let queryParams;
        let updateQuery;
  
        // Set update query depending on progress status
        if (progressStatus === 100) {
          updateQuery = `
            UPDATE parcels 
            SET currentLocation = ?, destinationLongitude = ?, destinationLatitude = ?, progressStatus = ?, status = 'delivered', updatedAt = ?
            WHERE trackingNumber = ?`;
  
          queryParams = [currentLocation, destinationLongitude, destinationLatitude, progressStatus, date, trackingNumberString];
        } else {
          updateQuery = `
            UPDATE parcels
            SET currentLocation = ?, destinationLongitude = ?, destinationLatitude = ?, progressStatus = ?, status = ?, updatedAt = ?
            WHERE trackingNumber = ?`;
  
          queryParams = [currentLocation, destinationLongitude, destinationLatitude, progressStatus, status, date, trackingNumberString];
        }
  
        // Update the parcel
        db.query(updateQuery, queryParams, (err, updateResult) => {
          if (err) {
            return res.status(500).json({ message: 'Error occurred while processing the location update request' });
          }
  
          // Fetch the updated parcel details after the update
          db.query("SELECT * FROM parcels WHERE TRIM(trackingNumber) = ?", [trackingNumberString], (err, updatedParcelResult) => {
            if (err) {
              return res.status(500).json({ message: 'Error fetching updated parcel data' });
            }
  
            const updatedParcel = updatedParcelResult[0];
  
            
  
            // Send success response
            return res.status(200).json({ message: 'Location successfully updated', updatedParcel });
          });
        });
      });
    } catch (error) {
      console.log("Server error: " + error.message);
      return res.status(500).json({ message: 'Server error' });
    }
};


const deleteParcel=async(req,res)=>{
    const {trackingNumber}=req.params;
    db.query("DELETE FROM parcels WHERE trackingNumber=?",[trackingNumber],(err,deleteResults)=>{
        if(err){
            return res.status(500).json({message:'Error occurred while processing your request'});
        }
        if(deleteResults.lenght === 0){
            return res.status(404).json({message:"No record found"});
        }

        const results=deleteResults[0];
       
        res.status(200).json({message:'Record deleted successfully',results});
    })
}

module.exports = {parcelCreation,getParcelDetail,updateParcelLocation,deleteParcel,getAllParcel};
