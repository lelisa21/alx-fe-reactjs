import { useState } from "react";


const RegistrationForm = () => {
const [username, setUsername] = useState("");
const [email, setEmail] = useState("");
const [password, setPassword] = useState("");
const [error, setError] = useState("");


const handleSubmit = (e) => {
e.preventDefault();


if (!username || !email || !password) {
setError("All fields are required");
return;
}


setError("");
console.log({ username, email, password });
alert("Registration Successful ");
};


return (
<form onSubmit={handleSubmit} className="form">
<h2>User Registration</h2>


{error && <p className="error">{error}</p>}


<input
type="text"
placeholder="Username"
value={username}
onChange={(e) => setUsername(e.target.value)}
/>


<input
type="email"
placeholder="Email"
value={email}
onChange={(e) => setEmail(e.target.value)}
/>


<input
type="password"
placeholder="Password"
value={password}
onChange={(e) => setPassword(e.target.value)}
/>


<button type="submit">Register</button>
</form>
);
};


export default RegistrationForm;
