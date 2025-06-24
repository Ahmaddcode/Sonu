import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import Input from "../../../../../../../../../src/components/ui/Input";
import Textarea from "../../../../../../../../../src/components/ui/Textarea";
import { Card, CardContent, CardHeader, CardTitle } from "../../../../../../../../../src/components/ui/Card";
import Form from "../../../../../../../../../src/components/ui/Form";
import Button from "../../../../../../../../../src/components/ui/Button";
import useToast from "../../../../../../../../../src/hooks/use-toast";
import apiRequest from "../../../../../../../../../src/lib/apiRequest";
import { X } from "lucide-react";
import React from "react";
import { insertVoucherSchema, type InsertVoucher } from "../../../../../Database-Schema-shared/db";

interface VoucherFormProps {
  onClose: () => void;
  onSuccess: () => void;
}
}
}

export default function VoucherForm({ onClose, onSuccess }: VoucherFormProps) {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const form = useForm<InsertVoucher>({
    resolver: zodResolver(insertVoucherSchema),
    defaultValues: {
      recipientName: "",
      accountNumber: "",
      amount: "",
      paymentDate: new Date().toISOString().split('T')[0],
      referenceNumber: "",
      paymentMethod: "wire",
      description: "",
      status: "pending",
      createdBy: "Bank Officer",
      workstation: `Desktop-${Math.floor(Math.random() * 100)}`,
    },
  });

  const createVoucherMutation = useMutation({
    mutationFn: async (data: InsertVoucher) => {
      const response = await apiRequest("POST", "/api/vouchers", data);
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/vouchers"] });
      queryClient.invalidateQueries({ queryKey: ["/api/vouchers/stats"] });
      toast({
        title: "Success",
        description: "Voucher created successfully",
      });
      onSuccess();
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "Failed to create voucher",
        variant: "destructive",
      });
    },
  });

  const onSubmit = (data: InsertVoucher) => {
    createVoucherMutation.mutate(data);
  };

  return (
    <Card className="w-full">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="text-xl">Create New Payment Voucher</CardTitle>
        <Button onClick={onClose}>
          <X className="h-4 w-4" />
        </Button>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            {/* Full form fields continue here with responsive design... */}
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
