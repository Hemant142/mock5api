const express = require("express");
const { AppointmentModel } = require("../Model/appointmentModel");
const { DateMiddleware } = require("../middleware/Datemiddleware");

const doctorRoute = express.Router();

doctorRoute.post("/", DateMiddleware, async (req, res) => {
  try {
    const appointment = new AppointmentModel(req.body);
    await appointment.save();
    res.status(200).send({ message: "New Appintment Saved" });
  } catch (err) {
    res.status(400).send({ message: err.message });
  }
});

doctorRoute.get("/", async (req, res) => {
  let filter = {};
  let sort = {};
  let page = parseInt(req.query.page) || 1;
  let limit = 5;
  if (req.query.specialization) {
    filter.specialization = req.query.specialization;
  }
  if (req.query.sort) {
    if (req.query.sort === "asc") {
      sort.date = 1;
    }
    if (req.query.sort === "desc") {
      sort.date = -1;
    }
  }
  if (req.query.search) {
    filter.name = { $regex: `${req.query.search}`, $options: "i" };
  }

  try {
    const appointment = await AppointmentModel.find(filter)
      .sort(sort)
      .skip((page - 1) * limit)
      .limit(limit);
    res.status(200).send(appointment);
  } catch (err) {
    res.status(400).send({ "error": err.message });
  }
});


doctorRoute.patch('/update/:id',DateMiddleware,async(req,res)=>{
    const {id} =req.params
    console.log(id)
    try{
        const found=await AppointmentModel.findById(id)
        console.log(found)
        if(found){
            await AppointmentModel.findByIdAndUpdate(id,req.body)
            res.status(200).send({'message':'Appintment Updated Successfully !'})
        }else{
            res.status(200).send({'message':'Appintment not found'})
        }
    }
    catch (err) {
        res.status(400).send({ "error": err.message });
      }

})



doctorRoute.delete('/delete/:id',DateMiddleware,async(req,res)=>{
    const {id} =req.params
    console.log(id)
    try{
        const found=await AppointmentModel.findById(id)
       
        if(found){
            await AppointmentModel.findByIdAndDelete({_id:id})
            res.status(200).send({'message':'Appintment Deleted Successfully !'})
        }else{
            res.status(200).send({'message':'Appintment not found'})
        }
    }
    catch (err) {
        res.status(400).send({ "error": err.message });
      }

})

module.exports={
    doctorRoute
}