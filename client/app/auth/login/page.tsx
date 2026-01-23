"use client";
import { ErrorMessage, Field, Form, Formik } from "formik";
import { signIn } from "next-auth/react";
import Link from "next/link";
import * as Yup from "yup";

const LoginSchema = Yup.object().shape({
  email: Yup.string().email("Invalid email").required("Email is required"),
  password: Yup.string().required("Password is required"),
});

const page = () => {
  return (
    <div>
      <h1>Login</h1>
      <Formik
        initialValues={{
          email: "",
          password: "",
        }}
        validationSchema={LoginSchema}
        onSubmit={async (values, { setSubmitting, setFieldError }) => {
          try {
            const res = await signIn("credentials", {
              email: values.email,
              password: values.password,
              redirect: false, // IMPORTANT
            });

            if (res?.error) {
              setFieldError("email", res.error);
              return;
            }

            window.location.href = "/profile/client";
          } catch (err) {
            setFieldError("email", "Something went wrong");
          } finally {
            setSubmitting(false);
          }
        }}
      >
        {({ isSubmitting }) => (
          <Form>
            <div>
              <label htmlFor="email">Email</label>
              <Field type="email" name="email" id="email" />
              <ErrorMessage name="email" component="div" />
            </div>

            <div>
              <label htmlFor="password">Password</label>
              <Field type="password" name="password" id="password" />
              <ErrorMessage name="password" component="div" />
            </div>

            <button type="submit" disabled={isSubmitting}>
              {isSubmitting ? "Logging in..." : "Login"}
            </button>
          </Form>
        )}
      </Formik>

      <hr />

      <button
      //   onClick={handleGoogleSignIn}
      >
        Sign in with Google
      </button>

      <p>
        Don't have an account? <Link href="/auth/register">Register here</Link>
      </p>
    </div>
  );
};

export default page;
