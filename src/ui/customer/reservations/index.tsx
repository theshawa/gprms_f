import { useState, type FC } from "react";
import { Box, Stepper, Step, StepLabel } from "@mui/material";
import type { StepperProps } from "@mui/material/Stepper";

export const CustomStepper = (props: StepperProps) => (
  <Stepper
    {...props}
    sx={{
      "& .MuiStepLabel-root .Mui-active": {
        color: "#166534", // active label
      },
      "& .MuiStepLabel-root .Mui-completed": {
        color: "#166534", // completed label
      },
      "& .MuiStepConnector-root .MuiStepConnector-line": {
        borderColor: "#166534", // line between steps
      },
      "& .MuiStepIcon-root": {
        color: "#d1d5db", // default step icon
      },
      "& .MuiStepIcon-root.Mui-active": {
        color: "#166534", // active step icon
      },
      "& .MuiStepIcon-root.Mui-completed": {
        color: "#166534", // completed step icon
      },
    }}
  />
);

export const Customer_Reservations: FC = () => {
  const steps = ["", "", "", "", ""];

  const [step, setStep] = useState(1);

  const nextStep = () => setStep((prev) => prev + 1);
  const prevStep = () => setStep((prev) => prev - 1);
  const done = () => setStep(1);

  const [selectedBuffet, setSelectedBuffet] = useState("");
  const [selectedGuests, setSelectedGuests] = useState("");
  const [reservationDate, setReservationDate] = useState("");
  const [timeSlot, setTimeSlot] = useState("");

  return (
    <div className="min-h-screen bg-white py-4">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 xl:px-16 2xl:px-40">
        <div className="flex flex-col lg:flex-row items-center justify-between gap-6 lg:gap-8 xl:gap-12 py-6 lg:py-12 bg-white">
          {/* Left Content Section */}
          <div className="w-full lg:w-1/2 xl:w-3/5 max-w-none lg:max-w-2xl xl:max-w-none order-2 lg:order-1">
            {step === 1 && (
              <div className="text-center lg:text-left">
                <h1 className="text-2xl sm:text-3xl lg:text-4xl xl:text-[2.5rem] font-medium leading-tight xl:leading-[3rem] font-serif mb-4">
                  Reserve Your Table Instantly
                </h1>
                <p className="text-gray-600 mb-6 text-sm sm:text-base">
                  Book your spot in just a few taps—choose your time, seats, and
                  we'll send you an instant SMS confirmation.
                </p>
                <button
                  onClick={nextStep}
                  className="bg-green-900 text-white px-6 py-2 rounded hover:bg-green-800 transition"
                >
                  Start Reservation
                </button>
              </div>
            )}

            {step === 2 && (
              <div className="w-full">
                <Box className="mb-8">
                  <CustomStepper activeStep={0} alternativeLabel>
                    {steps.map((label, index) => (
                      <Step key={index}>
                        <StepLabel>{label}</StepLabel>
                      </Step>
                    ))}
                  </CustomStepper>
                </Box>
                <div className="text-center lg:text-left">
                  <h2 className="text-xl sm:text-2xl lg:text-[1.6rem] font-medium leading-tight lg:leading-[3rem] font-serif mb-4">
                    Let us start with your name and mobile number
                  </h2>
                  <p className="text-gray-600 mb-6 text-sm sm:text-base">
                    Please provide your details to secure your reservation.
                  </p>
                  <div className="space-y-4 mb-6">
                    <input
                      type="text"
                      placeholder="Name"
                      className="border p-2 w-full"
                    />
                    <input
                      type="tel"
                      placeholder="Mobile Number"
                      className="border p-2 w-full"
                    />
                  </div>
                  <div className="flex flex-col sm:flex-row justify-end gap-2">
                    <button
                      onClick={prevStep}
                      className="px-6 py-2 border rounded-md text-gray-700 bg-white hover:bg-gray-50"
                    >
                      Back
                    </button>
                    <button
                      onClick={nextStep}
                      className="px-6 py-2 bg-green-900 text-white rounded-md hover:bg-green-800"
                    >
                      Next
                    </button>
                  </div>
                </div>
              </div>
            )}

            {step === 3 && (
              <div className="w-full">
                <Box className="mb-8">
                  <CustomStepper activeStep={1} alternativeLabel>
                    {steps.map((label, index) => (
                      <Step key={index}>
                        <StepLabel>{label}</StepLabel>
                      </Step>
                    ))}
                  </CustomStepper>
                </Box>
                <div className="text-center lg:text-left">
                  <h2 className="text-xl sm:text-2xl lg:text-[1.6rem] font-medium leading-tight lg:leading-[3rem] font-serif mb-4">
                    Verify your mobile number
                  </h2>
                  <p className="text-gray-600 mb-6 text-sm sm:text-base">
                    Hi Alex, we've sent your OTP to 0716060662. Please enter the
                    code below to continue
                  </p>
                  <input
                    type="text"
                    placeholder="Enter your OTP code here"
                    className="border p-2 w-full mb-4"
                  />
                  <div className="flex flex-col sm:flex-row justify-end gap-2">
                    <button
                      onClick={prevStep}
                      className="px-6 py-2 border rounded-md text-gray-700 bg-white hover:bg-gray-50"
                    >
                      Back
                    </button>
                    <button
                      onClick={nextStep}
                      className="px-6 py-2 bg-green-900 text-white rounded-md hover:bg-green-800"
                    >
                      Next
                    </button>
                  </div>
                </div>
              </div>
            )}

            {step === 4 && (
              <div className="w-full">
                <Box className="mb-8">
                  <CustomStepper activeStep={2} alternativeLabel>
                    {steps.map((label, index) => (
                      <Step key={index}>
                        <StepLabel>{label}</StepLabel>
                      </Step>
                    ))}
                  </CustomStepper>
                </Box>

                <div>
                  <h2 className="text-xl sm:text-2xl lg:text-[1.6rem] font-medium leading-tight lg:leading-[3rem] font-serif mb-4">
                    What can we assist you with today?
                  </h2>

                  {/* Buffet Selection */}
                  <p className="text-gray-700 font-medium mb-4">
                    Select your preferred buffet experience
                  </p>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 sm:gap-4 mb-6">
                    {[
                      { label: "Brunch", code: "A" },
                      { label: "Lunch", code: "B" },
                      { label: "High Tea", code: "C" },
                      { label: "Dinner", code: "D" },
                    ].map((option) => (
                      <button
                        key={option.code}
                        className={`border rounded-md px-2 sm:px-4 py-3 text-left flex items-center gap-2 sm:gap-3 text-sm sm:text-base
                            ${
                              selectedBuffet === option.code
                                ? "bg-black text-white border-black"
                                : "bg-gray-100 text-black"
                            }
                        `}
                        onClick={() => setSelectedBuffet(option.code)}
                      >
                        <span className="font-bold">{option.code}</span>{" "}
                        <span className="truncate sm:block">
                          {option.label}
                        </span>
                      </button>
                    ))}
                  </div>

                  {/* Date Picker */}
                  <div className="mb-6">
                    <label className="block text-gray-700 font-medium mb-2 text-sm sm:text-base">
                      Preferred date for reservation
                    </label>
                    <div className="flex items-center border rounded-md bg-gray-100 px-4 py-2">
                      <span className="mr-2 text-gray-500">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="w-5 h-5"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M8 7V3m8 4V3m-9 4h10M5 11h14M5 15h14M5 19h14"
                          />
                        </svg>
                      </span>
                      <input
                        type="date"
                        className="bg-transparent outline-none w-full"
                        value={reservationDate}
                        onChange={(e) => setReservationDate(e.target.value)}
                      />
                    </div>
                  </div>

                  {/* Time Slot Dropdown */}
                  <div className="mb-8">
                    <label className="block text-gray-700 font-medium mb-2 text-sm sm:text-base">
                      Select a time slot that works for you
                    </label>
                    <select
                      className="w-full border rounded-md bg-gray-100 px-4 py-2"
                      value={timeSlot}
                      onChange={(e) => setTimeSlot(e.target.value)}
                    >
                      <option value="">Select one...</option>
                      <option value="10:00 AM">10:00 AM</option>
                      <option value="12:00 PM">12:00 PM</option>
                      <option value="2:00 PM">2:00 PM</option>
                      <option value="6:00 PM">6:00 PM</option>
                      <option value="8:00 PM">8:00 PM</option>
                    </select>
                  </div>

                  {/* Buttons */}
                  <div className="flex flex-col sm:flex-row justify-end gap-2">
                    <button
                      onClick={prevStep}
                      className="px-6 py-2 border rounded-md text-gray-700 bg-white hover:bg-gray-50"
                    >
                      Back
                    </button>
                    <button
                      onClick={nextStep}
                      className="px-6 py-2 bg-green-900 text-white rounded-md hover:bg-green-800"
                    >
                      Next
                    </button>
                  </div>
                </div>
              </div>
            )}

            {step === 5 && (
              <div className="w-full">
                <Box className="mb-8">
                  <CustomStepper activeStep={3} alternativeLabel>
                    {steps.map((label, index) => (
                      <Step key={index}>
                        <StepLabel>{label}</StepLabel>
                      </Step>
                    ))}
                  </CustomStepper>
                </Box>
                <div className="text-center lg:text-left">
                  <h2 className="text-xl sm:text-2xl lg:text-[1.6rem] font-medium leading-tight lg:leading-[3rem] font-serif mb-4">
                    Let's confirm the number of guests
                  </h2>
                  <p className="text-gray-600 mb-6 text-sm sm:text-base">
                    How many guests will join?
                  </p>
                  <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2 sm:gap-4 mb-6">
                    {[
                      { label: "Just me", code: "A" },
                      { label: "2", code: "B" },
                      { label: "3", code: "C" },
                      { label: "4", code: "D" },
                      { label: "5", code: "E" },
                      { label: "Enter Count", code: "F" },
                    ].map((option) => (
                      <button
                        key={option.code}
                        className={`border rounded-md px-2 sm:px-4 py-3 text-center flex items-center justify-center gap-2 sm:gap-3 text-xs sm:text-sm lg:text-base
                            ${
                              selectedGuests === option.code
                                ? "bg-black text-white border-black"
                                : "bg-gray-100 text-black"
                            }
                        `}
                        onClick={() => setSelectedGuests(option.code)}
                      >
                        <span className="truncate">{option.label}</span>
                      </button>
                    ))}
                  </div>
                  <div className="flex flex-col sm:flex-row justify-end gap-2">
                    <button
                      onClick={prevStep}
                      className="px-6 py-2 border rounded-md text-gray-700 bg-white hover:bg-gray-50"
                    >
                      Back
                    </button>
                    <button
                      onClick={nextStep}
                      className="px-6 py-2 bg-green-900 text-white rounded-md hover:bg-green-800"
                    >
                      Next
                    </button>
                  </div>
                </div>
              </div>
            )}

            {step === 6 && (
              <div className="w-full">
                <Box className="mb-8">
                  <CustomStepper activeStep={4} alternativeLabel>
                    {steps.map((label, index) => (
                      <Step key={index}>
                        <StepLabel>{label}</StepLabel>
                      </Step>
                    ))}
                  </CustomStepper>
                </Box>
                <div className="text-center lg:text-left">
                  <h2 className="text-xl sm:text-2xl lg:text-[1.6rem] font-medium leading-tight lg:leading-[3rem] font-serif mb-4">
                    Any special requests? (Optional)
                  </h2>
                  <p className="text-gray-600 mb-6 text-sm sm:text-base">
                    Let us know how we can make your visit extra special.
                  </p>
                  <input
                    type="text"
                    placeholder="Add any notes or preferences"
                    className="border p-2 w-full mb-4"
                  />
                  <div className="mb-8">
                    <label className="block text-gray-700 font-medium mb-2 text-sm sm:text-base">
                      Occasion Type
                    </label>
                    <select
                      className="w-full border rounded-md bg-gray-100 px-4 py-2"
                      value={timeSlot}
                      onChange={(e) => setTimeSlot(e.target.value)}
                    >
                      <option value="">Select one...</option>
                      <option value="birthday">Birthday</option>
                      <option value="anniversary">Anniversary</option>
                      <option value="business">Business Meeting</option>
                      <option value="celebration">Celebration</option>
                    </select>
                  </div>
                  <div className="mb-8">
                    <label className="block text-gray-700 font-medium mb-2 text-sm sm:text-base">
                      Preferred Seating
                    </label>
                    <select
                      className="w-full border rounded-md bg-gray-100 px-4 py-2"
                      value={timeSlot}
                      onChange={(e) => setTimeSlot(e.target.value)}
                    >
                      <option value="">Select one...</option>
                      <option value="window">Window Side</option>
                      <option value="terrace">Terrace</option>
                      <option value="indoor">Indoor</option>
                      <option value="private">Private Area</option>
                    </select>
                  </div>
                  <div className="flex flex-col sm:flex-row justify-end gap-2">
                    <button
                      onClick={prevStep}
                      className="px-6 py-2 border rounded-md text-gray-700 bg-white hover:bg-gray-50"
                    >
                      Back
                    </button>
                    <button
                      onClick={nextStep}
                      className="px-6 py-2 rounded-md text-gray-700 bg-white hover:bg-gray-50"
                    >
                      Skip
                    </button>
                    <button
                      onClick={nextStep}
                      className="px-6 py-2 bg-green-900 text-white rounded-md hover:bg-green-800"
                    >
                      Next
                    </button>
                  </div>
                </div>
              </div>
            )}

            {step === 7 && (
              <div className="w-full">
                <Box className="mb-8">
                  <CustomStepper activeStep={5} alternativeLabel>
                    {steps.map((label, index) => (
                      <Step key={index}>
                        <StepLabel>{label}</StepLabel>
                      </Step>
                    ))}
                  </CustomStepper>
                </Box>
                <div className="text-center lg:text-left">
                  <h2 className="text-xl sm:text-2xl lg:text-[1.6rem] font-medium leading-tight lg:leading-[3rem] font-serif mb-4">
                    Reservation Summary
                  </h2>
                  <p className="text-gray-600 mt-2 mb-6 text-sm sm:text-base">
                    Your reservation has been placed successfully!
                  </p>

                  <div className="p-4 text-sm text-gray-700 space-y-1 bg-gray-50 rounded-md mb-6">
                    <p>
                      <span className="font-medium">Reservation No:</span>{" "}
                      #123456
                    </p>
                    <p>
                      <span className="font-medium">Table No:</span> 5
                    </p>
                    <p>
                      <span className="font-medium">Dining Area:</span> Rooftop
                    </p>
                    <p>
                      <span className="font-medium">Date:</span> July 20, 2025
                    </p>
                    <p>
                      <span className="font-medium">Time:</span> 7:00 PM
                    </p>
                  </div>

                  <div className="flex justify-end">
                    <button
                      onClick={done}
                      className="bg-green-800 hover:bg-green-700 text-white font-medium px-6 py-2 rounded-md transition"
                    >
                      OK
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Right Image Section */}
          <div className="w-full lg:w-1/2 xl:w-2/5 order-1 lg:order-2">
            <div className="w-full flex justify-center">
              <img
                src="/reserve.png"
                alt="Restaurant Interior"
                className="w-full max-w-sm sm:max-w-md lg:max-w-lg h-64 sm:h-80 lg:h-96 xl:h-[450px] object-cover rounded-lg shadow-lg"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
