import { useState } from "react";


const RegistrationForm = () => {
const [username, setUsername] = useState("");
const [email, setEmail] = useState("");
const [password, setPassword] = useState("");
const [errors, setErrors] = useState({});


const handleSubmit = (e) => {
e.preventDefault();


const newErrors = {};


if (!username) newErrors.username = "Username is required";
if (!email) newErrors.email = "Email is required";
if (!password) newErrors.password = "Password is required";


if (Object.keys(newErrors).length > 0) {
setErrors(newErrors);
return;
}


setErrors({});
console.log({ username, email, password });
alert("Registration Successful ✅");
};


return (
<form onSubmit={handleSubmit} className="form">
<h2>User Registration</h2>


<input
type="text"
placeholder="Username"
value={username}
onChange={(e) => setUsername(e.target.value)}
/>
{errors.username && <p className="error">{errors.username}</p>}


<input
type="email"
placeholder="Email"
value={email}
onChange={(e) => setEmail(e.target.value)}
/>
{errors.email && <p className="error">{errors.email}</p>}


<input
type="password"
placeholder="Password"
value={password}
onChange={(e) => setPassword(e.target.value)}
/>
{errors.password && <p className="error">{errors.password}</p>}


<button type="submit">Register</button>
</form>
);
};


export default RegistrationForm;
