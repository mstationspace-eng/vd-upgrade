import React from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import PhoneInput from "react-phone-input-2";
import "react-phone-input-2/lib/style.css";
import { useTranslate } from "@/contexts/TranslateContext";
import "../Style.css";
import xClose from "../assets/images/x-close.svg";

interface ContactUsProps {
  isOpen: boolean;
  onClose: () => void;
}

interface FormValues {
  name: string;
  phone: string;
  email: string;
  description: string;
}

export default function ContactUs({ isOpen, onClose }: ContactUsProps) {
  const { language } = useTranslate();

  const validationSchema = Yup.object({
    name: Yup.string().required(
      language === "ar" ? "الاسم مطلوب" : "Name is required"
    ),
    phone: Yup.string()
      .min(
        10,
        language === "ar" ? "رقم الهاتف غير صحيح" : "Invalid phone number"
      )
      .required(
        language === "ar" ? "رقم الهاتف مطلوب" : "Mobile number is required"
      ),
    email: Yup.string()
      .email(
        language === "ar"
          ? "البريد الإلكتروني غير صحيح"
          : "Invalid email address"
      )
      .required(
        language === "ar" ? "البريد الإلكتروني مطلوب" : "Email is required"
      ),
    description: Yup.string().required(
      language === "ar" ? "الوصف مطلوب" : "Description is required"
    ),
  });

  const initialValues: FormValues = {
    name: "",
    phone: "",
    email: "",
    description: "",
  };

  const handleSubmit = (values: FormValues) => {
    console.log("Form submitted:", values);
    onClose();
  };

  if (!isOpen) return null;

  const isRTL = language === "ar";

  return (
    <div className="fixed inset-0 z-[99999] flex items-center justify-center">
      <div
        className="absolute inset-0 bg-black/30 backdrop-blur-sm"
        onClick={onClose}
      />

      <div
        className={`relative backdrop-blur-20 rounded-[4px] border border-white/10 p-6 w-full max-w-md mx-4 ${
          isRTL ? "text-right" : "text-left"
        }`}
      >
        <button
          onClick={onClose}
          className={`absolute top-4 ${
            isRTL ? "left-4" : "right-4"
          } complex-shadows w-6 h-6 flex items-center justify-center rounded-[4px] text-black hover:text-gray-700 text-xl font-semibold`}
        >
          <img className="w-5" src={xClose} />
        </button>

        <h2 className="text-2xl font-bold text-white opacity-90 mb-6">
          {language === "ar" ? "تواصل معنا" : "Contact Us"}
        </h2>

        <Formik
          initialValues={initialValues}
          validationSchema={validationSchema}
          onSubmit={handleSubmit}
        >
          {({ isSubmitting, setFieldValue, values }) => (
            <Form className="space-y-2">
              {/* Name Field */}
              <div>
                <label
                  htmlFor="name"
                  className="block text-sm font-medium text-black mb-1"
                >
                  {language === "ar" ? ":الاسم" : "Name:"}
                </label>
                <div className="relative">
                  <Field
                    dir={isRTL ? "rtl" : "ltr"}
                    type="text"
                    id="name"
                    name="name"
                    className={`w-full px-3 py-2 ${isRTL ? "pl-10" : "pr-10"} complex-shadows rounded-md focus:outline-none focus:ring-2 focus:ring-gray-500`}
                    placeholder={
                      language === "ar" ? "الاسم ثلاثي" : "Full Name"
                    }
                  />
                  <div className={`absolute right-3 top-3 ${isRTL ? "left-3" : "right-3"}`}>
                  <svg
                      className="w-5 h-5 text-gray-600"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                      />
                    </svg>
                  </div>
                </div>
                <ErrorMessage
                  name="name"
                  component="div"
                  className="text-red-500 text-sm mt-1"
                />
              </div>

              <div>
                <label
                  htmlFor="phone"
                  className="block text-sm font-medium text-black mb-1"
                >
                  {language === "ar"
                    ? ":أدخل رقم هاتفك المحمول"
                    : "Enter your mobile number:"}
                </label>
                <div dir="ltr">
                  <PhoneInput
                    country={"sa"}
                    value={values.phone}
                    onChange={(phone) => setFieldValue("phone", phone)}
                    inputProps={{
                      name: "phone",
                      dir: isRTL ? "rtl" : "ltr",
                      style: {
                        textAlign: isRTL ? "right" : "left",
                        direction: isRTL ? "rtl" : "ltr",
                      },
                    }}
                    containerClass="w-full"
                    inputClass={`!w-full !px-3 !py-5 !pl-14 complex-shadows !rounded-md focus:outline-none focus:ring-2 focus:ring-gray-500 !text-black !border-none ${
                      isRTL ? "!text-right" : "!text-left"
                    }`}
                    buttonClass="!border-none !bg-transparent !rounded-md"
                    dropdownClass="!rounded-md text-left"
                    searchClass="!rounded-md"
                  />
                </div>
                <ErrorMessage
                  name="phone"
                  component="div"
                  className="text-red-500 text-sm mt-1"
                />
              </div>

              {/* Email Field */}
              <div>
                <label
                  htmlFor="email"
                  className="block text-sm font-medium text-black mb-1"
                >
                  {language === "ar"
                    ? ":أدخل بريدك الإلكتروني"
                    : "Enter your email:"}
                </label>
                <div className="relative">
                  <Field
                    dir={isRTL ? "rtl" : "ltr"}
                    type="email"
                    id="email"
                    name="email"
                    className={`w-full px-3 py-2 ${isRTL ? "pl-10" : "pr-10"} complex-shadows rounded-md focus:outline-none focus:ring-2 focus:ring-gray-500`}
                    placeholder="@gmail.com"
                  />
                  <div className={`absolute right-3 top-3 ${isRTL ? "left-3" : "right-3"}`}>
                  <svg
                      className="w-5 h-5 text-gray-600"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                      />
                    </svg>
                  </div>
                </div>
                <ErrorMessage
                  name="email"
                  component="div"
                  className="text-red-500 text-sm mt-1"
                />
              </div>

              {/* Description Field */}
              <div>
                <label
                  htmlFor="description"
                  className="block text-sm font-medium text-black mb-1"
                >
                  {language === "ar" ? ":الوصف" : "Description:"}
                </label>
                <div className="relative">
                  <Field
                    dir={isRTL ? "rtl" : "ltr"}
                    as="textarea"
                    id="description"
                    name="description"
                    rows={4}
                    className={`w-full px-3 py-2 ${isRTL ? "pl-10" : "pr-10"} complex-shadows rounded-md focus:outline-none focus:ring-2 focus:ring-gray-500`}
                    placeholder={
                      language === "ar"
                        ? "اكتب وصفاً مفصلاً عن طلبك..."
                        : "Write a detailed description of your request..."
                    }
                  />
                  <div className={`absolute right-3 top-3 ${isRTL ? "left-3" : "right-3"}`}>
                    <svg
                      className="w-5 h-5 text-gray-600"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                      />
                    </svg>
                  </div>
                </div>
                <ErrorMessage
                  name="description"
                  component="div"
                  className="text-red-500 text-sm mt-1"
                />
              </div>

              {/* Submit Button */}
              <div className="pt-4">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full px-4 py-2 complex-shadows text-black font-semibold rounded-md transition-colors disabled:opacity-50"
                >
                  {isSubmitting
                    ? language === "ar"
                      ? "جاري الإرسال..."
                      : "Sending..."
                    : language === "ar"
                    ? "ارسال الطلب"
                    : "Send Request"}
                </button>
              </div>
            </Form>
          )}
        </Formik>
      </div>
    </div>
  );
}
