import { useState, type FC } from "react";
import { Box, Stepper, Step, StepLabel } from "@mui/material";

export const Customer_Reservations: FC = () => {
  const steps = ["", "", "", "", ""];

  const [step, setStep] = useState(1);

  const nextStep = () => setStep((prev) => prev + 1);
  const prevStep = () => setStep((prev) => prev - 1);
  const done = () => setStep(1);

  const [selectedBuffet, setSelectedBuffet] = useState("");
  const [reservationDate, setReservationDate] = useState("");
  const [timeSlot, setTimeSlot] = useState("");

  return (
    <>
      <Box className="flex items-center justify-between px-40 py-12 bg-white">
        {step === 1 && (
          <div className="w-140">
            <h1 className="text-[2.5rem] font-medium leading-[3rem] font-serif">
              Reserve Your Table Instantly
            </h1>
            <p className="text-gray-600 mb-6">
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
          <div className="flex flex-col justify-center">
            <Stepper activeStep={0} alternativeLabel>
              {steps.map((label) => (
                <Step key={label}>
                  <StepLabel>{label}</StepLabel>
                </Step>
              ))}
            </Stepper>
            <div className="w-140 mt-8 flex flex-col justify-center">
              <h2 className="text-[1.6rem] font-medium leading-[3rem] font-serif">
                Let us start with your name and mobile number
              </h2>
              <p className="text-gray-600 mb-6">
                Please provide your details to secure your reservation.
              </p>
              <input
                type="text"
                placeholder="Name"
                className="border p-2 w-full mb-4"
              />
              <input
                type="tel"
                placeholder="Mobile Number"
                className="border p-2 w-full mb-4"
              />
              <div className="flex justify-end gap-2">
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
          <div className="flex flex-col justify-between">
            <Stepper activeStep={1} alternativeLabel>
              {steps.map((label) => (
                <Step key={label}>
                  <StepLabel>{label}</StepLabel>
                </Step>
              ))}
            </Stepper>
            <div className="w-140 mt-8 flex flex-col justify-center">
              <h2 className="text-[1.6rem] font-medium leading-[3rem] font-serif">
                Verify your mobile number
              </h2>
              <p className="text-gray-600 mb-6">
                Hi Alex, we’ve sent your OTP to 0716060662. Please enter the
                code below to continue
              </p>
              <input
                type="text"
                placeholder="Enter your OTP code here"
                className="border p-2 w-full mb-4"
              />
              <div className="flex justify-end gap-2">
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
          <div className="flex flex-col justify-between">
            <Stepper activeStep={2} alternativeLabel>
              {steps.map((label) => (
                <Step key={label}>
                  <StepLabel>{label}</StepLabel>
                </Step>
              ))}
            </Stepper>

            <div className="w-140 mt-8">
              <h2 className="text-[1.6rem] font-medium leading-[3rem] font-serif">
                What can we assist you with today?
              </h2>

              {/* Buffet Selection */}
              <p className="text-gray-700 font-medium mb-4">
                Select your preferred buffet experience
              </p>
              <div className="grid grid-cols-4 gap-4 mb-6">
                {[
                  { label: "Brunch", code: "A" },
                  { label: "Lunch", code: "B" },
                  { label: "High Tea", code: "C" },
                  { label: "Dinner", code: "D" },
                ].map((option) => (
                  <button
                    key={option.code}
                    className={`border rounded-md px-4 py-3 text-left flex items-center gap-3
                        ${
                          selectedBuffet === option.code
                            ? "bg-black text-white border-black"
                            : "bg-gray-100 text-black"
                        }
                    `}
                    onClick={() => setSelectedBuffet(option.code)}
                  >
                    <span className="font-bold">{option.code}</span>{" "}
                    {option.label}
                  </button>
                ))}
              </div>

              {/* Date Picker */}
              <div className="mb-6">
                <label className="block text-gray-700 font-medium mb-2">
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
                <label className="block text-gray-700 font-medium mb-2">
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
              <div className="flex justify-end gap-2">
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
          <div className="flex flex-col justify-between">
            <Stepper activeStep={3} alternativeLabel>
              {steps.map((label) => (
                <Step key={label}>
                  <StepLabel>{label}</StepLabel>
                </Step>
              ))}
            </Stepper>
            <div className="w-140 mt-8 flex flex-col justify-center">
              <h2 className="text-[1.6rem] font-medium leading-[3rem] font-serif">
                Let's confirm the number of guests
              </h2>
              <p className="text-gray-600 mb-6">How many guests will join?</p>
              <div className="flex gap-4 mb-6">
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
                    className={`border rounded-md px-4 py-3 text-left flex items-center gap-3
                        ${
                          selectedBuffet === option.code
                            ? "bg-black text-white border-black"
                            : "bg-gray-100 text-black"
                        }
                    `}
                    onClick={() => setSelectedBuffet(option.code)}
                  >
                    {option.label}
                  </button>
                ))}
              </div>
              <div className="flex justify-end gap-2">
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
          <div className="flex flex-col justify-between">
            <Stepper activeStep={4} alternativeLabel>
              {steps.map((label) => (
                <Step key={label}>
                  <StepLabel>{label}</StepLabel>
                </Step>
              ))}
            </Stepper>
            <div className="w-140 mt-8 flex flex-col justify-center">
              <h2 className="text-[1.6rem] font-medium leading-[3rem] font-serif">
                Any special requests? (Optional)
              </h2>
              <p className="text-gray-600 mb-6">
                Let us know how we can make your visit extra special.
              </p>
              <input
                type="text"
                placeholder="Add any notes or preferences"
                className="border p-2 w-full mb-4"
              />
              <div className="mb-8">
                <label className="block text-gray-700 font-medium mb-2">
                  Occasion Type
                </label>
                <select
                  className="w-full border rounded-md bg-gray-100 px-4 py-2"
                  value={timeSlot}
                  onChange={(e) => setTimeSlot(e.target.value)}
                >
                  <option value="">Select one...</option>
                  <option value="">1</option>
                  <option value="">1</option>
                  <option value="">1</option>
                  <option value="">1</option>
                </select>
              </div>
              <div className="mb-8">
                <label className="block text-gray-700 font-medium mb-2">
                  Preferred Seating
                </label>
                <select
                  className="w-full border rounded-md bg-gray-100 px-4 py-2"
                  value={timeSlot}
                  onChange={(e) => setTimeSlot(e.target.value)}
                >
                  <option value="">Select one...</option>
                  <option value="">1</option>
                  <option value="">1</option>
                  <option value="">1</option>
                  <option value="">1</option>
                </select>
              </div>
              <div className="flex justify-end gap-2">
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
          <div className="flex flex-col justify-between">
            <Stepper activeStep={5} alternativeLabel>
              {steps.map((label) => (
                <Step key={label}>
                  <StepLabel>{label}</StepLabel>
                </Step>
              ))}
            </Stepper>
            <div className="w-140 mt-8 flex flex-col justify-center">
              <div>
                <h2 className="text-[1.6rem] font-medium leading-[3rem] font-serif">
                  Reservation Summary
                </h2>
                <p className="text-gray-600 mt-2">
                  Your reservation has been placed successfully!
                </p>
              </div>

              <div className="p-4 text-sm text-gray-700 space-y-1">
                <p>
                  <span className="font-medium">Reservation No:</span> #123456
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
        <div>
          <img
            src="/reserve.png"
            alt="Restaurant Interior"
            className="w-auto h-[450px] rounded-lg shadow-lg"
          />
        </div>
      </Box>
    </>
  );
};
