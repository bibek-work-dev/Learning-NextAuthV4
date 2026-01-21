"use client";

import { useRouter } from "next/navigation";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { GraphQLClient } from "graphql-request";
import Link from "next/link";

const graphqlClient = new GraphQLClient(
  process.env.NEXT_PUBLIC_GRAPHQL_ENDPOINT || "http://localhost:3001/graphql"
);

const RegisterSchema = Yup.object().shape({
  name: Yup.string()
    .min(2, "Name too short")
    .max(50, "Name too long")
    .required("Name is required"),
  email: Yup.string().email("Invalid email").required("Email is required"),
  password: Yup.string()
    .min(6, "Password must be at least 6 characters")
    .required("Password is required"),
  confirmPassword: Yup.string()
    .oneOf([Yup.ref("password")], "Passwords must match")
    .required("Confirm password is required"),
});

export default function Register() {
  const router = useRouter();

  const handleRegister = async (
    values: any,
    { setSubmitting, setErrors }: any
  ) => {
    try {
      const REGISTER_MUTATION = `
        mutation register($name: String!, $email: String!, $password: String!) {
          register(registerInput: { name: $name, email: $email, password: $password }) {
            id
            email
            name
          }
        }
      `;

      console.log("here");

      const data = await graphqlClient.request(REGISTER_MUTATION, {
        name: values.name,
        email: values.email,
        password: values.password,
      });

      console.log("data", data);

      if (data) {
        alert("Registration successful! Please login.");
        router.push("/auth/login");
      }
    } catch (error: any) {
      console.error("Registration error:", error);
      setErrors({
        email: error.response?.errors?.[0]?.message || "Registration failed",
      });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div>
      <h1>Register</h1>
      <Formik
        initialValues={{
          name: "",
          email: "",
          password: "",
          confirmPassword: "",
        }}
        validationSchema={RegisterSchema}
        onSubmit={handleRegister}
      >
        {({ isSubmitting }) => (
          <Form>
            <div>
              <label htmlFor="name">Name</label>
              <Field type="text" name="name" id="name" />
              <ErrorMessage name="name" component="div" />
            </div>
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
            <div>
              <label htmlFor="confirmPassword">Confirm Password</label>
              <Field
                type="password"
                name="confirmPassword"
                id="confirmPassword"
                autoComplete="new-password"
              />
              <ErrorMessage name="confirmPassword" component="div" />
            </div>
            <button type="submit" disabled={isSubmitting}>
              {isSubmitting ? "Registering..." : "Register"}
            </button>
          </Form>
        )}
      </Formik>

      <p>
        Already have an account? <Link href="/auth/login">Login here</Link>
      </p>
    </div>
  );
}
