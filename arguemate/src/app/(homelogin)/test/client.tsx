"use client"

import { useState } from "react"
import { saveUser } from "./saveUser"
import { useRouter } from "next/navigation";

export default function Client() {
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const router = useRouter();


    return <form onSubmit={async () => {
        await saveUser(name, email, password);

        router.refresh();
    }}>
        <input type="text" placeholder="name"  value={name} onChange={(e) => setName(e.target.value)}/>
        <input type="text" placeholder="email"  value={email} onChange={(e) => setEmail(e.target.value)}/>
        <input type="text" placeholder="password" value={password} onChange={(e) => setPassword(e.target.value)} />
        <button>Save User</button>
    </form>
}