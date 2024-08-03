import { catchAsyncErrors } from "../middlewares/catchAsyncErrors.js";
import ErrorHandler from "../middlewares/errorMiddleware.js";
import { Appointment } from "../models/appointmentSchema.js";

export const postAppointment = catchAsyncErrors(async (req, res, next) => {
  const { name, email, phone, appointment_date, title, status } = req.body;

  if (!name || !email || !phone || !appointment_date || !title) {
    return next(new ErrorHandler("Please Fill Full Form!", 400));
  }

  const appointment = await Appointment.create({
    name,
    email,
    phone,
    appointment_date,
    title,
    status,
  });

  res.status(200).json({
    success: true,
    appointment,
    message: "Appointment Sent!",
  });
});

export const getAllAppointments = catchAsyncErrors(async (req, res, next) => {
  const appointments = await Appointment.find();
  res.status(200).json({
    success: true,
    appointments,
  });
});

export const updateAppointmentStatus = catchAsyncErrors(
  async (req, res, next) => {
    const { id } = req.params;
    const { status } = req.body;

    const appointment = await Appointment.findByIdAndUpdate(
      id,
      { status },
      {
        new: true,
        runValidators: true,
        useFindAndModify: false,
      }
    );

    if (!appointment) {
      return next(new ErrorHandler("Appointment not found!", 404));
    }

    res.status(200).json({
      success: true,
      message: "Appointment Status Updated!",
      appointment,
    });
  }
);

export const deleteAppointment = catchAsyncErrors(async (req, res, next) => {
  const { id } = req.params;

  const appointment = await Appointment.findByIdAndDelete(id);

  if (!appointment) {
    return next(new ErrorHandler("Appointment Not Found!", 404));
  }

  res.status(200).json({
    success: true,
    message: "Appointment Deleted!",
  });
});
