import { DineInService } from "@/services/customer/dine-in";
import { PageError } from "@/ui/staff/shared/page-error";
import { PageLoader } from "@/ui/staff/shared/page-loader";
import { useQuery } from "@tanstack/react-query";
import type { FC } from "react";
import { useParams } from "react-router-dom";
import { QKs } from "../query-keys";

export const Customer_DineInPage: FC = () => {
  const tableId = useParams<{ tableId: string }>().tableId!;

  const { data, isLoading, error } = useQuery({
    queryKey: QKs.customer_dinein(tableId),
    queryFn: async () => DineInService.getDiningTableById(Number(tableId)),
  });

  if (isLoading) {
    return <PageLoader />;
  }

  if (error) {
    return <PageError title="dining table" error={error} />;
  }

  return (
    <>
      <h1>Dine In</h1>
      <p>Table ID: {tableId}</p>
    </>
  );
};
