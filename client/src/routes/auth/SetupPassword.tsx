import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from "@/components/ui/input-group";
import { Label } from "@/components/ui/label";
import { Spinner } from "@/components/ui/spinner";
import { api } from "@/lib/api";
import { errorHandler } from "@/lib/utils";
import { useFormik } from "formik";
import { Check, CheckCircle2, Eye, EyeOff, Lock, X } from "lucide-react";
import { useState } from "react";
import { useNavigate, useSearchParams } from "react-router";
import { toast } from "sonner";
import * as Yup from "yup";

export default function SetupPassword() {
  const [success, setSuccess] = useState<boolean>(false);
  const [searchParams] = useSearchParams();
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [loading, setLoading] = useState(false);

  const token = searchParams.get("token");

  const navigate = useNavigate();
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

  return (
    <div className="min-h-screen flex items-center justify-center bg-muted/40 px-4">
      <Card className="w-full max-w-md shadow-sm border">
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
          {success ? (
            <div className="flex items-center justify-center">
              <div className="flex items-center flex-col space-y-5">
                <CheckCircle2 size={100} stroke="green" strokeWidth={1} />
                <p className="text-muted-foreground font-medium text-base text-center">
                  Your account has been set up successfully, click below button
                  to login
                </p>
                <Button type="button" onClick={() => navigate("/login")}>
                  Click here to login
                </Button>
              </div>
            </div>
          ) : (
            <form
              noValidate
              onSubmit={formik.handleSubmit}
              className="flex flex-col w-full gap-5"
            >
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
    </div>
  );
}
