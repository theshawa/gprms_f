import { customerReservationsAtom, reservationFormAtom, reservationLoadingAtom, reservationStepAtom, type ReservationFormData } from "@/atoms/customer-reservation"
import { useAtom } from "jotai"
import { useAlert } from "./useAlert";
import { useCustomerAuth } from "./useCustomerAuth";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { ReservationService, type CreateReservationRequest } from "@/services/customer/reservation";


export const useReservation = () => {
    const [formData, setFormData] = useAtom(reservationFormAtom);
    const [currentStep, setCurrentStep] = useAtom(reservationStepAtom);
    const [reservations, setReservations] = useAtom(customerReservationsAtom);
    const [loading, setLoading] = useAtom(reservationLoadingAtom);

    const {showSuccess, showError} = useAlert();
    const { auth } = useCustomerAuth();
    const queryClient = useQueryClient();

    // Create reservation mutation
    const createReservationMutation = useMutation({
    mutationFn: (data: CreateReservationRequest) => ReservationService.createReservation(data),
    onSuccess: (response) => {
      showSuccess(`Reservation created successfully! Your reservation code is: ${response.reservation.reservationCode}`);
      setCurrentStep(7); // Go to confirmation step
      queryClient.invalidateQueries({ queryKey: ['customer-reservations'] });
    },
    onError: (error: any) => {
      showError(error.response?.data?.message || "Failed to create reservation");
    },
  });

  // Get customer reservations query
  const customerReservationsQuery = useQuery({
    queryKey: ['customer-reservations', auth?.user?.phoneNumber],
    queryFn: () => ReservationService.getReservationsByPhone(auth?.user?.phoneNumber || formData.phoneNumber),
    enabled: !!(auth?.user?.phoneNumber || formData.phoneNumber),
    staleTime: 5 * 60 * 1000, // 5 minutes
  });

  // Helper functions
  const updateFormData = (updates: Partial<ReservationFormData>) => {
    setFormData(prev => ({ ...prev, ...updates }));
  };


const nextStep = () => setCurrentStep(prev => Math.min(prev + 1, 7));
  const prevStep = () => setCurrentStep(prev => Math.max(prev - 1, 1));
  const goToStep = (step: number) => setCurrentStep(Math.max(1, Math.min(step, 7)));
  const resetForm = () => {
    setFormData({
      customerName: "",
      phoneNumber: "",
      reservationDate: "",
      timeSlot: "",
      guestCount: 1,
      meal: "Dinner",
      diningAreaId: undefined,
      specialRequests: "",
      occasionType: "",
      seatingPreference: "",
    });
    setCurrentStep(1);
  };

  const submitReservation = async () => {
    try {
      setLoading(true);
      
      // Validate required fields
      if (!formData.customerName || !formData.phoneNumber || !formData.reservationDate || !formData.timeSlot) {
        showError("Please fill in all required fields");
        return;
      }

      // Create reservation request
      const reservationData: CreateReservationRequest = {
        phoneNumber: formData.phoneNumber,
        customerName: formData.customerName,
        reservationDate: new Date(formData.reservationDate + 'T' + formData.timeSlot).toISOString(),
        timeSlot: formData.timeSlot,
        guestCount: formData.guestCount,
        meal: formData.meal,
        diningAreaId: formData.diningAreaId,
        specialRequests: formData.specialRequests,
      };

      await createReservationMutation.mutateAsync(reservationData);
    } catch (error) {
      console.error("Error creating reservation:", error);
    } finally {
      setLoading(false);
    }
  };

  return {
    // State
    formData,
    currentStep,
    reservations: customerReservationsQuery.data?.reservations || { upcoming: [], past: [], total: 0 },
    loading: loading || createReservationMutation.isPending || customerReservationsQuery.isLoading,
    
    // Actions
    updateFormData,
    nextStep,
    prevStep,
    goToStep,
    resetForm,
    submitReservation,
    
    // Query states
    isCreating: createReservationMutation.isPending,
    createError: createReservationMutation.error,
    reservationsError: customerReservationsQuery.error,
  }



}