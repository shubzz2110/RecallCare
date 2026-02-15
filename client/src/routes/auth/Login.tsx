import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import * as Yup from "yup";
import { useFormik } from "formik";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from "@/components/ui/input-group";
import { Eye, EyeOff, Lock, Mail } from "lucide-react";
import { useState } from "react";
import { api } from "@/lib/api";
import type { User } from "@/types/types";
import { useAuthStore } from "@/store/auth";
import { Spinner } from "@/components/ui/spinner";
import { AxiosError } from "axios";
import { toast } from "sonner";

interface LoginResponse {
  success: boolean;
  message: string;
  user: User;
  accessToken: string;
}

export default function Login() {
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);

  const authStore = useAuthStore();

  const LoginSchema = Yup.object().shape({
    email: Yup.string()
      .email("Enter a valid email")
      .required("Clinic Email is required"),
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
      if (error instanceof AxiosError) {
        const errorMessage =
          error.response?.data?.message ||
          error.response?.data?.error ||
          error.response?.data?.detail ||
          (typeof error.response?.data === "string"
            ? error.response.data
            : null) ||
          error.message ||
          "Login failed. Please try again.";

        toast.error("Login failed", {
          description: errorMessage,
        });
      } else {
        // Handle non-axios errors
        toast.error("Login failed", {
          description: "An unexpected error occurred. Please try again.",
        });
      }
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-muted/40 px-4">
      <Card className="w-full max-w-sm shadow-sm border">
        <CardHeader className="text-center space-y-2">
          <img
            src="/recallcare-logo.png"
            alt="RecallCare"
            className="w-20 mx-auto"
          />

          <CardTitle className="text-2xl font-semibold">RecallCare</CardTitle>

          <CardDescription>Clinic patient reminder system</CardDescription>
        </CardHeader>

        <CardContent>
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
        </CardContent>
      </Card>
    </div>
  );
}
