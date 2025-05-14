import { Alert, Button, Label, Spinner, TextInput } from "flowbite-react";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

export default function SignUp() {
  const [formData, setFormData] = useState({});
  const [errorMessage, setErrorMessage] = useState(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.id]: e.target.value.trim() });
  };

  const submitHandler = async (e) => {
    e.preventDefault();
  
    // Validate form data
    if (!formData.username || !formData.email || !formData.password) {
      return setErrorMessage("Please fill out all fields.");
    }
  
    try {
      setLoading(true);
      setErrorMessage(null);
  
      // Send the signup request
      const res = await fetch("http://localhost:5000/api/auth/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
  
      // Check if the response status is not ok (not in the 200 range)
      if (!res.ok) {
        // If the response is not ok, parse the error message
        const errorData = await res.json(); // Try parsing the error response
        return setErrorMessage(errorData.message || "An error occurred");
      }
  
      // Parse the JSON response
      const data = await res.json(); // Only parse if the response is OK
  
      // If the response is successful, navigate to sign-in
      if (data.success) {
        setLoading(false);
        navigate("/sign-in"); // Redirect to the sign-in page
      } else {
        // If success flag is false, show the message
        setErrorMessage(data.message); // Show the error message from the backend
      }
    } catch (error) {
      console.error("Error during signup:", error);
      setLoading(false);
      setErrorMessage("An unexpected error occurred. Please try again.");
    }
  };
  

  return (
    <div className="min-h-screen mt-20 ">
      <div className="flex p-3 max-w-3xl mx-auto flex-col md:flex-row md:items-center gap-5">
        <div className="flex-1">
          <Link to="/" className=" font-bold dark:text-white text-4xl">
            <span className="px-2 py-1 bg-gradient-to-r from-indigo-500 via-blue-500 to-pink-500 rounded-lg text-white">
              Deepak Blog
            </span>
          </Link>
          <p className="text-sm mt-5">
            Join our community and start sharing your story—sign up now to
            unlock a world of creativity, connection, and endless possibilities!
          </p>
        </div>
        <div className="flex-1">
          <form className="flex flex-col gap-4" onSubmit={submitHandler}>
            <div>
              <Label value="Your username" />
              <TextInput
                type="text"
                placeholder="Username"
                id="username"
                onChange={handleChange}
              />
            </div>
            <div>
              <Label value="Your email" />
              <TextInput
                type="email"
                placeholder="example@gmail.com"
                id="email"
                onChange={handleChange}
              />
            </div>
            <div>
              <Label value="Your password" />
              <TextInput
                type="password"
                placeholder="Password"
                id="password"
                onChange={handleChange}
              />
            </div>
            <Button
              gradientDuoTone="purpleToPink"
              type="submit"
              disabled={loading}
            >
              {loading ? (
                <>
                  <Spinner size="sm" />
                  <span className="pl-3">Loading...</span>
                </>
              ) : (
                "Sign Up"
              )}
            </Button>
          </form>
          <div className="flex gap-2 text-sm mt-5">
            <span>Have an account?</span>
            <Link to="/sign-in" className=" text-blue-500">
              Sign In
            </Link>
          </div>
          {errorMessage && (
            <Alert className="mt-5" color="failure">
              {errorMessage}
            </Alert>
          )}
        </div>
      </div>
    </div>
  );
}
