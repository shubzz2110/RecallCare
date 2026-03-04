"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  CheckCircle2,
  EyeOff,
  Eye,
  Lock,
  XCircleIcon,
  Check,
  X,
} from "lucide-react";
import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import * as Yup from "yup";
import { useFormik } from "formik";
import { toast } from "sonner";
import { api } from "@/lib/api";
import { errorHandler } from "@/lib/utils";
import { useRouter } from "next/navigation";
import { Label } from "@/components/ui/label";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from "@/components/ui/input-group";
import { Spinner } from "@/components/ui/spinner";
import { Skeleton } from "@/components/ui/skeleton";

interface SetupAccountInfo {
  name: string;
  email: string;
  clinic: {
    name: string;
    phone: string;
  } | null;
}

export default function SetupAccountPage() {
  const token = useSearchParams().get("token");
  const router = useRouter();

  const [success, setSuccess] = useState<boolean>(false);
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [loading, setLoading] = useState(false);
  const [accountInfo, setAccountInfo] = useState<SetupAccountInfo | null>(null);
  const [verifying, setVerifying] = useState(true);
  const [tokenValid, setTokenValid] = useState(true);

  // Verify token and fetch account info on mount
  useEffect(() => {
    if (!token) {
      setVerifying(false);
      setTokenValid(false);
      return;
    }

    const verifyToken = async () => {
      try {
        const { data } = await api.get(
          `/auth/verify-setup-token?token=${token}`,
        );
        if (data.success) {
          setAccountInfo(data.user);
          setTokenValid(true);
        } else {
          setTokenValid(false);
        }
      } catch {
        setTokenValid(false);
      } finally {
        setVerifying(false);
      }
    };

    verifyToken();
  }, [token]);

  const setupPasswordSchema = Yup.object().shape({
    password: Yup.string()
      .required("Password is required")
      .min(8, "Password must be at least 8 characters")
      .matches(/[A-Z]/, "Password must contain at least one uppercase letter")
      .matches(/[0-9]/, "Password must contain at least one number")
      .matches(
        /[!@#$%^&*(),.?":{}|<>]/,
        "Password must contain at least one special character",
      ),
  });

  const formik = useFormik({
    initialValues: {
      password: "",
    },
    validationSchema: setupPasswordSchema,
    onSubmit: (values) => handlesetupPassword(values),
  });
  const handlesetupPassword = async (values: { password: string }) => {
    try {
      setLoading(true);
      const response = await api.post<{ success: boolean; message: string }>(
        "/auth/set-password",
        {
          password: values.password,
          token: token,
        },
      );
      if (response && response.data && response.data.success) {
        toast.success("Success", { description: response.data.message });
        setSuccess(true);
      }
    } catch (error) {
      errorHandler(error);
    } finally {
      setLoading(false);
    }
  };
  const password = formik.values.password;

  const passwordRules = {
    required: password.length > 0,
    length: password.length >= 8,
    uppercase: /[A-Z]/.test(password),
    number: /[0-9]/.test(password),
    special: /[!@#$%^&*(),.?":{}|<>]/.test(password),
  };

  if (verifying) {
    return (
      <Card className="w-full max-w-md shadow-sm border">
        <CardContent className="space-y-4">
          <Skeleton className="h-5 w-3/4" />
          <Skeleton className="h-4 w-1/2" />
          <Skeleton className="h-4 w-2/3" />
          <Skeleton className="h-10 w-full" />
          <Skeleton className="h-10 w-full" />
        </CardContent>
      </Card>
    );
  }

  if (!token || !tokenValid) {
    return (
      <Card className="w-full max-w-md shadow-sm border">
        <CardContent className="flex flex-col items-center text-center space-y-4 py-10">
          <div className="flex items-center justify-center w-16 h-16 rounded-full bg-red-50">
            <XCircleIcon size={32} className="text-red-500" />
          </div>
          <div className="space-y-1.5">
            <h3 className="text-lg font-semibold">Invalid Setup Link</h3>
            <p className="text-sm text-muted-foreground text-balance">
              This link is either invalid or has already been used. Please check
              your email for the correct link to set up your account.
            </p>
          </div>
          <Button
            variant="outline"
            className="mt-2"
            onClick={() => router.push("/login")}
          >
            Go to Login
          </Button>
        </CardContent>
      </Card>
    );
  }
  return (
    <Card className="w-full max-w-md shadow-sm border">
      <CardContent>
        {success ? (
          <div className="flex flex-col items-center text-center space-y-4 py-10">
            <div className="flex items-center justify-center w-16 h-16 rounded-full bg-green-50">
              <CheckCircle2 size={32} className="text-green-500" />
            </div>
            <div className="space-y-1.5">
              <h3 className="text-lg font-semibold">Account Setup Complete</h3>
              <p className="text-sm text-muted-foreground text-balance">
                Your account has been set up successfully. You can now log in
                with your new password.
              </p>
            </div>
            <Button
              variant="outline"
              className="mt-2"
              onClick={() => router.push("/login")}
            >
              Go to Login
            </Button>
          </div>
        ) : (
          <form
            noValidate
            onSubmit={formik.handleSubmit}
            className="flex flex-col w-full gap-5"
          >
            {accountInfo && (
              <div className="flex flex-col gap-2 rounded-lg bg-muted p-4 text-sm">
                {accountInfo.clinic && (
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Clinic</span>
                    <span className="font-medium">
                      {accountInfo.clinic.name}
                    </span>
                  </div>
                )}
                {accountInfo.clinic?.phone && (
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Phone</span>
                    <span className="font-medium">
                      {accountInfo.clinic.phone}
                    </span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Email</span>
                  <span className="font-medium">{accountInfo.email}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Doctor</span>
                  <span className="font-medium">{accountInfo.name}</span>
                </div>
              </div>
            )}
            <div className="flex flex-col gap-1.5 w-full">
              <Label htmlFor="signup-password">Password</Label>
              <InputGroup>
                <InputGroupInput
                  id="signup-password"
                  autoComplete="new-password"
                  type={showPassword ? "text" : "password"}
                  name="password"
                  placeholder="Enter your password"
                  value={formik.values.password}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  disabled={loading}
                />
                <InputGroupAddon>
                  <Lock />
                </InputGroupAddon>
                <InputGroupAddon align={"inline-end"}>
                  <button
                    type="button"
                    className="text-muted-foreground"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </InputGroupAddon>
              </InputGroup>
              <div className="flex items-center gap-1 mt-1.5">
                {passwordRules.required ? (
                  <Check size={18} className="text-green-500" />
                ) : (
                  <X size={18} className="text-red-500" />
                )}
                <p className="text-xs text-gray-400 font-normal">
                  Password is required
                </p>
              </div>
              <div className="flex items-center gap-1">
                {passwordRules.length ? (
                  <Check size={18} className="text-green-500" />
                ) : (
                  <X size={18} className="text-red-500" />
                )}
                <p className="text-xs text-gray-400 font-normal">
                  Password must be at least 8 characters
                </p>
              </div>
              <div className="flex items-center gap-1">
                {passwordRules.uppercase ? (
                  <Check size={18} className="text-green-500" />
                ) : (
                  <X size={18} className="text-red-500" />
                )}
                <p className="text-xs text-gray-400 font-normal">
                  Password must contain at least one uppercase letter
                </p>
              </div>
              <div className="flex items-center gap-1">
                {passwordRules.number ? (
                  <Check size={18} className="text-green-500" />
                ) : (
                  <X size={18} className="text-red-500" />
                )}
                <p className="text-xs text-gray-400 font-normal">
                  Password must contain at least one number
                </p>
              </div>
              <div className="flex items-center gap-1">
                {passwordRules.special ? (
                  <Check size={18} className="text-green-500" />
                ) : (
                  <X size={18} className="text-red-500" />
                )}
                <p className="text-xs text-gray-400 font-normal">
                  Password must contain at least one special character
                </p>
              </div>
            </div>
            <Button type="submit">{loading && <Spinner />}Submit</Button>
          </form>
        )}
      </CardContent>
    </Card>
  );
}
