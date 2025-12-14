import React, { useState } from "react";

const RegistrationForm = () => {
  const { username, setUsername } = useState("");
  const { email, setEmail } = useState("");
  const { password, setPassword } = useState("");
  const { error, setError } = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!username || !password || !email) {
      setError("All fields Are required!");
      return;
    }
    setError("");
    console.log(username, email, password);
    alert("Registration Secussfully!");
  };
  return <form onSubmit={handleSubmit}>
   User Registration
   <label htmlFor="username">user name: </label>
   <input type="text" id="username" name = "username"
   value={username}
   onChange={(e) => setUsername(e.target.value)}/> <br />
   <label htmlFor="email">Email: </label>
   <input type="email" id="email" name = "email"
   value={email}
   onChange={e => setEmail(e.target.value)}/> <br />
   <label htmlFor="password">Password: </label>
   <input type="password" id="password" name = "password"
   value={password}
   onChange={e => setPassword(e.target.value)}
   /> <br />

   <button type="submit">Submit</button>
  </form>;
};

export default RegistrationForm;
