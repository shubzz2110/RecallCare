"use client";

import { Button } from "@/components/ui/button";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from "@/components/ui/input-group";
import { Label } from "@/components/ui/label";
import { Spinner } from "@/components/ui/spinner";
import { api } from "@/lib/api";
import { errorHandler } from "@/lib/utils";
import { useAuthStore } from "@/store/auth";
import { User } from "@/types/types";
import { useFormik } from "formik";
import { Eye, EyeOff, Lock, Mail } from "lucide-react";
import { useState } from "react";
import * as Yup from "yup";

interface LoginResponse {
  success: boolean;
  message: string;
  user: User;
  accessToken: string;
}

export default function LoginForm() {
  const authStore = useAuthStore();

  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);

  const LoginSchema = Yup.object().shape({
    email: Yup.string()
      .email("Enter a valid email")
      .required("Email is required"),
    password: Yup.string().required("Password is required"),
  });

  const formik = useFormik({
    initialValues: { email: "", password: "" },
    validationSchema: LoginSchema,
    onSubmit: (values) => handleLoginUser(values),
  });

  const handleLoginUser = async (values: {
    email: string;
    password: string;
  }) => {
    try {
      setLoading(true);
      const response = await api.post<LoginResponse>("/auth/login", {
        email: values.email,
        password: values.password,
      });
      if (response.data && response.data.success) {
        authStore.setAuth(response.data.user, response.data.accessToken);

        if (response.data.user.role === "ADMIN") {
          window.location.href = "/internal/clinics";
        } else {
          window.location.href = "/dashboard";
        }
      }
    } catch (error) {
      errorHandler(error);
    } finally {
      setLoading(false);
    }
  };
  return (
    <form noValidate onSubmit={formik.handleSubmit} className="space-y-5">
      <div className="flex flex-col gap-1.5 w-full">
        <Label htmlFor="login-email">Email</Label>
        <InputGroup>
          <InputGroupInput
            id="login-email"
            autoComplete="email"
            type="email"
            placeholder="youremail@example.com"
            name="email"
            onChange={formik.handleChange}
            value={formik.values.email}
            onBlur={formik.handleBlur}
            autoFocus
            disabled={loading}
          />
          <InputGroupAddon>
            <Mail />
          </InputGroupAddon>
        </InputGroup>
        {formik.touched.email && formik.errors.email && (
          <p className="text-error">{formik.errors.email}</p>
        )}
      </div>
      <div className="flex flex-col gap-1.5 w-full">
        <Label htmlFor="login-password">Password</Label>
        <InputGroup>
          <InputGroupInput
            id="login-password"
            autoComplete="current-password"
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
        {formik.touched.password && formik.errors.password && (
          <p className="text-error">{formik.errors.password}</p>
        )}
      </div>
      <div className="mt-2.5">
        <Button className="w-full" type="submit">
          {loading && <Spinner />}
          Login
        </Button>
      </div>

      <p className="text-xs text-muted-foreground text-center pt-2">
        Need help? WhatsApp support available.
      </p>
    </form>
  );
}
